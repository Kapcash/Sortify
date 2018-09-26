import { Injectable, HttpService, Logger, UseInterceptors } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { SpotifyUser } from './models/spotifyUser';
import { Observable } from 'rxjs';

@Injectable()
export class SortifyService {

  /** List of personal user's playlists (id) */
  userPlaylist: Set<string>;
  /** List of all tracks in the special 'sortify-trash' playlist (id) */
  sortifyTrashPlaylist: Set<string>;
  /** List of all sorted tracks stored by <track id, list of playlist containing the track> */
  sortedTracks: Map<string, Set<string>>;
  /** List of all saved tracks in the user's library (id) */
  savedTracks: Set<string>;

  constructor(private readonly httpService: HttpService){}

  /**
   * Return a new set contains all sorted tracks id
   */
  private getSortedTracksAsSet(): Set<string>{
    return new Set(this.sortedTracks.keys());
  }

  /**
   * Get the spotify user informations
   * @param req The incoming request from client side
   * @see SpotifyUser Type model
   */
  getUserInfos(req): Observable<SpotifyUser> {
    return this.httpService.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + req.params.jwt.spotify_token,
      },
    }).pipe(
      map((res) => {
        return new SpotifyUser(res.data);
      }),
    );
  }

  initializeTracksMaps(req): void {
    this.httpService.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: 'Bearer ' + req.params.jwt.spotify_token,
      },
    }).pipe(
      map((res) => {
        return res.data;
      }),
    );

    /* TODO
     * Use axios.all to run concurrent queries
     * 1) Get all user's playlist, by filtering with "owner" property
     * 2) Get both saved tracks and playlists tracks, add them to dedicated array while fetching data (only the id)
     * 3) Uniq the playlist's track array to avoid doublon
     * 4) Get differences between saved tracks list and playlist one to get all unsorted tracks :)
     */
  }

  /**
   * Get all unsorted tracks, ie. all saved tracks that are not sorted into user's playlists
   * @param req The incoming request from client side
   */
  getUnsortedTracks(req): any {
    // Get the differences (symetric)
    var differences = this.getSortedTracksAsSet();
    for (var elem of this.savedTracks) {
      differences.delete(elem);
    }
    return differences;
  }
}
