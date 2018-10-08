import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { map, flatMap, catchError } from 'rxjs/operators';
import { Observable, of, from, throwError} from 'rxjs';
import axios, { AxiosError } from 'axios';
import { SortifyJwt } from '../../shared/models/sortify-jwt.model';
import { SpotifyUser } from 'models/spotifyUser';

@Injectable()
export class SortifyService {

  constructor(private readonly httpService: HttpService){}

  /**
   * Return a new set contains all sorted tracks id
   */
  private getMapKeysAsSet(map: Map<any, any>): Set<any> {
    return new Set(map.keys());
  }

  /**
   * Get the spotify user informations
   * @param req The incoming request from client side
   * @see SpotifyUser Type model
   */
  getUserInfos(jwt: SortifyJwt): Observable<SpotifyApi.UserProfileResponse> {
    return this.httpService.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + jwt.spotify_token,
      },
    }).pipe(
      map((res) => res.data),
      catchError((error) => { 
        throw new HttpException(error.response.data.error.message, error.response.data.error.status)
      }),
    );
  }

  repeatRequests(jwt: SortifyJwt, endpoint: string): Promise<Array<any>>{
    let tempArray = new Array<any>();

    const recursive = (jwt: SortifyJwt, endpoint: string): any => {
      return this.httpService.get(endpoint, {
        headers: {
          Authorization: 'Bearer ' + jwt.spotify_token,
        },
      }).pipe(
        flatMap((res) => {
          tempArray = tempArray.concat(res.data.items);
          if(res.data.next) {
            return recursive(jwt, res.data.next);
          } else {
            return of(tempArray);
          }
        })
      ).toPromise();
    }

    return recursive(jwt, endpoint);
  }

  initializeTracksMaps(spotifyUser: SpotifyApi.UserProfileResponse, jwt: SortifyJwt): Observable<any> {

    /** List of personal user's playlists (id) */
    let userPlaylist: Set<string>;
    /** List of all tracks in the special 'sortify-trash' playlist (id) */
    let sortifyTrashPlaylist: Set<string>;
    /** List of all sorted tracks stored by <track id, list of playlist containing the track> */
    let sortedTracks: Map<string, Array<string>> = new Map<string, Array<string>>();
    /** List of all saved tracks in the user's library (id) */
    let savedTracks: Set<string>;

    // Get all user's playlists
    const getPlaylists = this.repeatRequests(jwt, 'https://api.spotify.com/v1/me/playlists?filter=owner,id').then(
      (playlists) => playlists.filter((playlist) => playlist.owner.href === spotifyUser.href).map((playlist) => playlist.id));
    const getSavedTracks =  this.repeatRequests(jwt, 'https://api.spotify.com/v1/me/tracks').then(
      (tracks) => tracks.map((trackObj) => trackObj.track.id));

    return from(axios.all([getPlaylists, getSavedTracks]).then(axios.spread((playlists: Array<string>, tracks: Array<string>) => {
      savedTracks = new Set(tracks);
      userPlaylist = new Set(playlists);
      const promises: Promise<any>[] = [];
      playlists.forEach(playlistId => {
        const getPlaylistsTracksPromise =  this.repeatRequests(jwt, `https://api.spotify.com/v1/playlists/${playlistId}/tracks`).then((playlistTracks) => {
          playlistTracks.forEach((trackObj) => {
            if (trackObj) {
              // If the track is not in the list
              if(!sortedTracks.has(trackObj.track.id)) {
                // We add it with a new set of playlist, including the current playlist
                sortedTracks.set(trackObj.track.id, [playlistId]);
              } else {
                // Or we get the already existing set of playlist and we add the current one
                sortedTracks.get(trackObj.track.id).push(playlistId);
              }
            }
          });
        });
        promises.push(getPlaylistsTracksPromise);
      });
      return axios.all(promises).then(() => {
        return {
          userPlaylist: [...userPlaylist],
          sortedTracks: [...sortedTracks],
          savedTracks: [...savedTracks],
        }
      });
    })));
  }

  /**
   * Get all unsorted tracks, ie. all saved tracks that are not sorted into user's playlists
   * @param req The incoming request from client side. It requires the body to contain sortedTracks:
   *            Map<string, Array<string>> and savedTracks: Array<string>
   */
  getUnsortedTracks(sortedTracks: any[], savedTracks: string[]): any {
    // Get the differences (symetric)
    const sortedTracksMap = new Map(sortedTracks);
    const savedTracksSet = new Set(savedTracks);
    var differences = this.getMapKeysAsSet(sortedTracksMap);
    for (var elem of savedTracksSet) {
      differences.delete(elem);
    }
    return [...differences];
  }
}
