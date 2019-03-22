import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { map, flatMap, catchError } from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import axios from 'axios';
import { SortifyJwt } from './models/sortify-jwt.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist } from './models/playlist.interface';
import { SortifyUser } from './models/user.interface';
import { Track } from './models/track.interface';
import * as mongoose from 'mongoose';

@Injectable()
export class SortifyService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<SortifyUser>,
    // @InjectModel('Track') private readonly trackModel: Model<Track>,
    private readonly httpService: HttpService,
  ) {
    this.httpService.axiosRef.interceptors.request.use((req) => {
      // TODO add jwt to all spotify api calls
      return req;
    });
  }

  mapSpotifyToSortifyUser(userFromSpotifyApi: any): any{
    return {
      _id: userFromSpotifyApi.id,
      href: userFromSpotifyApi.href,
      uri: userFromSpotifyApi.uri,
      imageUrl: userFromSpotifyApi.images[0].url,
      displayName: userFromSpotifyApi.display_name,
      email: userFromSpotifyApi.email,
    };
  }

  /**
   * Get the spotify user informations
   * @param req The incoming request from client side
   * @see SpotifyUser Type model
   */
  getUserInfos(jwt: SortifyJwt): Observable<SortifyUser> {
    return this.httpService.get('https://api.spotify.com/v1/me',
      { headers: { Authorization: 'Bearer ' + jwt.spotify_token } }
    ).pipe(
      map((res) => {
        const user = new this.userModel(this.mapSpotifyToSortifyUser(res.data));
        user.update({upsert: true});
        return user.toObject();
      }),
      catchError((error) => {
        throw new HttpException(error.response.data.error.message, error.response.data.error.status);
      }),
    );
  }

  repeatRequests<T>(jwt: SortifyJwt, endpoint: string): Promise<Array<T>>{
    let tempArray = new Array<any>();

    const recursive = (_jwt: SortifyJwt, _endpoint: string): any => {
      return this.httpService.get(_endpoint, {
        headers: {
          Authorization: 'Bearer ' + _jwt.spotify_token,
        },
      }).pipe(
        flatMap((res) => {
          tempArray = tempArray.concat(res.data.items);
          if (res.data.next) {
            return recursive(_jwt, res.data.next);
          } else {
            return of(tempArray);
          }
        })
      ).toPromise();
    }

    return recursive(jwt, endpoint);
  }

  isPlaylistUpToDate(storedPlaylists: Array<Playlist>, playlistToCheck: Playlist): boolean{
    const samePlaylist: Playlist = storedPlaylists.find((spl: Playlist) => playlistToCheck._id === spl._id);
    // Check if the playlist hasn't changed
    return samePlaylist && playlistToCheck.snapshot === samePlaylist.snapshot;
  }

  mapSpotifyToSortifyTracks(tracks: Array<SpotifyApi.PlaylistTrackObject>): Array<Track> {
    return tracks.map(trackFromPlaylist => {
      if (trackFromPlaylist.is_local) {
        console.debug(`Can't save track ${trackFromPlaylist.track.name} since it's a local track`);
        // TODO Handle local track
      }

      return new Track().fromSpotifyTrack(trackFromPlaylist.track);
    });
  }

  getAllTracks(userHref: string) : Array<Track> {
    const { db } = mongoose.connections[1];
    return db.collection('playlists').aggregate([
      { $match: { owner: userHref } },
      { $unwind: '$tracks' },
      {
        $group: {
          _id: '$tracks._id',
          playlists: { $addToSet: '$_id' },
          artists: { $first: '$tracks.artists' },
          href: { $first: '$tracks.href' },
          name: { $first: '$tracks.name' },
        }
      },
    ]).toArray();
  }

  getPlaylists(userHref: string) {
    const { db } = mongoose.connections[1];
    return db.collection('playlists').find({owner: userHref}).toArray();
  }

  getTracksOfPlaylist(userHref: string, playlistId: string): Array<Track> {
    const { db } = mongoose.connections[1];
    return db.collection('playlists').aggregate([
      { $match: { owner: userHref } },
      { $unwind: '$tracks' },
      {
        $group: {
          _id: '$tracks._id',
          playlists: { $addToSet: '$_id' },
          artists: { $first: '$tracks.artists' },
          href: { $first: '$tracks.href' },
          name: { $first: '$tracks.name' },
        },
      },
      { $match: { playlists: playlistId } },
    ]).toArray();
  }

  // TODO Handle 429: Too many request error

  async getUnsortedTracks(spotifyUser: SortifyUser, jwt: SortifyJwt) {
    const savedTracks = await this.repeatRequests<SpotifyApi.PlaylistTrackObject>(jwt, 'https://api.spotify.com/v1/me/tracks');
    const allSavedTracks = this.mapSpotifyToSortifyTracks(savedTracks);
    const allTracksInPlaylists = await this.getAllTracks(spotifyUser.href);
    return allSavedTracks.filter((tr) => allTracksInPlaylists.some((t) => tr._id === t._id));
  }

  // TODO : interceptor that add a function to 'req' that get the jwt informations

  /**
   * Initialise database for the user. It will:
   *  - get all playlists created by user
   *  - list all the tracks by playlist
   * TODO: optimize parallele request time
   */
  async initializeTracksMaps(spotifyUser: SortifyUser, jwt: SortifyJwt): Promise<void> {
    const start = Date.now();
    const { db } = mongoose.connections[1];
    const dbPlaylist = db.collection('playlists');

    // Which fields from spotify playlists we need
    const playlistFilters = 'id, snapshot_id, name, owner';
    // Which fields from spotify tracks we need
    const tracksFilters = 'id, artists, is_local, href, name';

    console.log('Starting initialization! Fiouuuuu!');

    // Get all user's playlists promise
    const playlists = await this.repeatRequests<SpotifyApi.PlaylistObjectFull>(jwt, `https://api.spotify.com/v1/me/playlists?filter=${playlistFilters}`);
    const mappedPlaylists: Array<Playlist> = playlists
      .filter((playlist) => playlist.owner.href === spotifyUser.href)
      .map((playlist) => {
        return {
          _id: playlist.id,
          name: playlist.name,
          owner: playlist.owner.href,
          snapshot: playlist.snapshot_id,
          tracksHref: playlist.tracks.href,
        } as Playlist;
      });

    // Get all playlists already stored in db for the user
    const storedPlaylists: Array<Playlist> = await dbPlaylist.find({owner: spotifyUser.href}).toArray();

    // Filter to get playlist out of date
    const playlistsToUpdate = mappedPlaylists.filter((pl: Playlist) => !this.isPlaylistUpToDate(storedPlaylists, pl));
    const playlistsToInsert = mappedPlaylists.filter((pl: Playlist) => !storedPlaylists.find((spl: Playlist) => pl._id === spl._id));

    console.info(`${playlistsToUpdate.length} playlists to update.`);
    console.info(`${playlistsToInsert.length} playlists to insert.`);
    // Get all tracks from playlists
    await Promise.all(playlistsToUpdate.map(async (plToUpdate: Playlist) => {
      const playlistTracks = await this.repeatRequests<SpotifyApi.PlaylistTrackObject>(jwt, `${plToUpdate.tracksHref}?filter=${tracksFilters}`);

      // Map the track objects in the playlist
      plToUpdate.tracks = this.mapSpotifyToSortifyTracks(playlistTracks);
    }));

    try {
      if (playlistsToUpdate.length > 0) {
        // Insert new playlists
        await dbPlaylist.insertMany(playlistsToInsert, {ordered: false});
        // And replace already existing
      }
      if (playlistsToInsert.length > 0) {
        playlistsToUpdate.forEach((pl: Playlist) => {
          dbPlaylist.replaceOne({_id: pl._id}, pl);
        });
      }
    } catch (e) {
      // If already inserted once, we update them
      // TODO Response error code ?
    }
    console.info('Done in %dms', Date.now() - start);
  }

  /**
   * Add all tracks to sort in a specific playlist
   * @param tracksToSort 
   */
  sortTracks(jwt: SortifyJwt, tracksToSort: string[]): any {
    // First, create the playlist
    return this.httpService.post(`https://api.spotify.com/v1/users/${jwt.payload.user.id}/playlists`,
      {
        name: 'sortify-to-sort',
        public: false,
        description: 'Sortify playlist regrouping all unsorted tracks'
      },
      { headers: { Authorization: 'Bearer ' + jwt.spotify_token } }
    ).pipe(
      map((res) => {
        // Add the tracks in the playlist
        this.httpService.post(`https://api.spotify.com/v1/playlists/${res.data.id}/tracks`,
          { uris: [tracksToSort] },
          { headers: { Authorization: 'Bearer ' + jwt.spotify_token } }
        ).pipe(
          map(_res => _res.data),
          catchError((error) => {
            throw new HttpException(error.response.data.error.message, error.response.data.error.status);
          }),
        );
      }),
      catchError((error) => {
        throw new HttpException(error.response.data.error.message, error.response.data.error.status);
      }),
    );
  }

  cleanTracks(sortedTracks: any[], tracksToClean: Array<string>) {
    // Filter the sortedTracks to only the tracks to clean
    sortedTracks = sortedTracks.filter((elem: string) => {
      return tracksToClean.includes(elem[0]);
    })
    // We create a list of all playlists to clean, merging all playlists of each track
    let listOfPlaylistsToClean = sortedTracks.reduce((playlistsToClean: any[], trackMap: any[]) => {
      return playlistsToClean.push(trackMap[1]);
    });
    listOfPlaylistsToClean = listOfPlaylistsToClean.filter((value: any, index: number, self: any) => {
      return self.indexOf(value) === index;
    });
    // And we remove the track from each of these playlists
    listOfPlaylistsToClean.forEach((playlist: string) => {
      this.removeTracksFromPlaylist(playlist, tracksToClean);
    });
  }

  removeTracksFromPlaylist(playlistId: string, tracksToRemove: string[]) {
    tracksToRemove.map((elem) => {
      return { uri: elem };
    });

    this.httpService.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { params: { tracks: tracksToRemove } });
  }
}
