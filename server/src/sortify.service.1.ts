// import { Injectable, HttpService, HttpException } from '@nestjs/common';
// import { map, flatMap, catchError } from 'rxjs/operators';
// import { Observable, of, from} from 'rxjs';
// import axios from 'axios';
// import { SortifyJwt } from '../../shared/models/sortify-jwt.model';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Playlist } from 'models/playlist.interface';
// import { SortifyUser } from 'models/user.interface';
// import { Track } from 'models/track.interface';

// @Injectable()
// export class SortifyService {

//   constructor(
//     @InjectModel('Playlist') private readonly playlistModel: Model<Playlist>,
//     @InjectModel('User') private readonly userModel: Model<SortifyUser>,
//     @InjectModel('Track') private readonly trackModel: Model<Track>,
//     private readonly httpService: HttpService,
//   ) {

//   }

//   mapSpotifyToSortifyUser(userFromSpotifyApi: any): any{
//     return {
//       _id: userFromSpotifyApi.id,
//       href: userFromSpotifyApi.href,
//       uri: userFromSpotifyApi.uri,
//       imageUrl: userFromSpotifyApi.images[0].url,
//       displayName: userFromSpotifyApi.display_name,
//       email: userFromSpotifyApi.email,
//     }
//   }

//   /**
//    * Get the spotify user informations
//    * @param req The incoming request from client side
//    * @see SpotifyUser Type model
//    */
//   getUserInfos(jwt: SortifyJwt): Observable<SortifyUser> {
//     return this.httpService.get('https://api.spotify.com/v1/me',
//       { headers: { Authorization: 'Bearer ' + jwt.spotify_token } }
//     ).pipe(
//       map((res) => {
//         const user = new this.userModel(this.mapSpotifyToSortifyUser(res.data));
//         user.update({upsert: true});
//         return user.toObject();
//       }),
//       catchError((error) => { 
//         throw new HttpException(error.response.data.error.message, error.response.data.error.status)
//       }),
//     );
//   }

//   repeatRequests(jwt: SortifyJwt, endpoint: string): Promise<Array<any>>{
//     let tempArray = new Array<any>();

//     const recursive = (jwt: SortifyJwt, endpoint: string): any => {
//       return this.httpService.get(endpoint, {
//         headers: {
//           Authorization: 'Bearer ' + jwt.spotify_token,
//         },
//       }).pipe(
//         flatMap((res) => {
//           tempArray = tempArray.concat(res.data.items);
//           if(res.data.next) {
//             return recursive(jwt, res.data.next);
//           } else {
//             return of(tempArray);
//           }
//         })
//       ).toPromise();
//     }

//     return recursive(jwt, endpoint);
//   }

//   isPlaylistUpToDate(storedPlaylists: Array<Playlist>, playlistToCheck: Playlist): boolean{
//     const samePlaylist: Playlist = storedPlaylists.find((spl: Playlist) => playlistToCheck._id === spl._id);
//     // Check if the playlist hasn't changed
//     return samePlaylist && playlistToCheck.snapshot === samePlaylist.snapshot;
//   }

//   async initializeTracksMaps(sortifyUser: SortifyUser, jwt: SortifyJwt): Promise<any> {

//     // Which fields from spotify playlists we need
//     const playlistFilters = 'id, snapshot_id, name, owner';
//     // Which fields from spotify tracks we need
//     const tracksFilters = 'id, artists, is_local, href, name';

//     // Get all user's playlists promise
//     const getUserPlaylists = this.repeatRequests(jwt, `https://api.spotify.com/v1/me/playlists?filter=${playlistFilters}`).then(
//       playlists => playlists
//         .filter((playlist) => playlist.owner.href === sortifyUser.href)
//         .map((playlist) => {
//           return {
//             _id: playlist.id,
//             name: playlist.name,
//             userId: sortifyUser._id,
//             owner: playlist.owner.href,
//             snapshot: playlist.snapshot_id,
//             tracksHref: playlist.tracks.href,
//           };
//         })
//       );

//     // Get all user's saved tracks promise
//     const getSavedTracks =  this.repeatRequests(jwt, 'https://api.spotify.com/v1/me/tracks');

//     console.log('Starting initialization! Fiouuuuu!');

//     // Get playlists and saved tracks
//     const [playlists, savedTracks] = await axios.all([getUserPlaylists, getSavedTracks]);
    
//     // Filter on the playlists already up to date
//     const playlistsToUpdate = playlists.filter((pl) => !this.isPlaylistUpToDate(storedPlaylists, pl));
      
//     // Get all playlists already stored in db for the user
//     const storedPlaylists: Array<Playlist> = await this.playlistModel.find({userId: sortifyUser._id});

//     // Get all tracks from playlists
//     playlistsToUpdate.forEach(async plToUpdate => {
//       const playlistTracks = await this.repeatRequests(jwt, `${plToUpdate.tracksHref}?filter=${tracksFilters}`);
      
//       // Map the track objects in the playlist
//       playlistTracks.map(trackFromPlaylist => {
//         if (trackFromPlaylist.is_local) {
//           console.debug(`[user:${sortifyUser._id}] Can't save track ${trackFromPlaylist.name} since it's a local track`);
//           return; // TODO Check if it remove the local track from the array in map()
//         }

//         const trackPl = new this.trackModel(trackFromPlaylist.track);
//         trackPl._id = trackPl.id;
//         return {
//           added_at: trackFromPlaylist.added_at,
//           is_local: trackFromPlaylist.is_local,
//           track: trackPl,
//         }
//       });
//       plToUpdate.tracks = playlistTracks;
//     });
    
//     const allTracks: Array<Track> = savedTracks.slice(0);
//     // Update playlists with their list of tracks
//     playlistsToUpdate.forEach((pl) => {
//       pl.tracks.forEach((tr: Track) => {
        
//         // Update tracks with their list of playlists
//         let foundTrack = allTracks.find((atr) => atr._id === tr._id);
//         if (!foundTrack) {
//           foundTrack = tr;
//           allTracks.push(tr);
//         }
//         tr.playlists.push(pl._id);
//       })
//     });

//     // TODO Save all tracks + playlists
//   };

//   /**
//    * Add all tracks to sort in a specific playlist
//    * @param tracksToSort 
//    */
//   sortTracks(jwt: SortifyJwt, tracksToSort: string[]): any {
//     // First, create the playlist
//     return this.httpService.post(`https://api.spotify.com/v1/users/${jwt.payload.user.id}/playlists`,
//       {
//         name: 'sortify-to-sort',
//         public: false,
//         description: 'Sortify playlist regrouping all unsorted tracks'
//       },
//       { headers: { Authorization: 'Bearer ' + jwt.spotify_token } }
//     ).pipe(
//       map((res) => {
//         // Add the tracks in the playlist
//         this.httpService.post(`https://api.spotify.com/v1/playlists/${res.data.id}/tracks`,
//           { uris: [tracksToSort] },
//           { headers: { Authorization: 'Bearer ' + jwt.spotify_token } }
//         ).pipe(
//           map((res) => res.data),
//           catchError((error) => {
//             throw new HttpException(error.response.data.error.message, error.response.data.error.status)
//           }),
//         );
//       }),
//       catchError((error) => { 
//         throw new HttpException(error.response.data.error.message, error.response.data.error.status)
//       }),
//     );
//   }

//   cleanTracks(sortedTracks: any[], tracksToClean: Array<string>) {
//     // Filter the sortedTracks to only the tracks to clean
//     sortedTracks = sortedTracks.filter((elem: string) => {
//       return tracksToClean.includes(elem[0]);
//     })
//     // We create a list of all playlists to clean, merging all playlists of each track
//     let listOfPlaylistsToClean = sortedTracks.reduce((playlistsToClean: any[], trackMap: any[]) => {
//       return playlistsToClean.push(trackMap[1]);
//     });
//     listOfPlaylistsToClean = listOfPlaylistsToClean.filter((value: any, index: number, self: any) => {
//       return self.indexOf(value) === index;
//     });
//     // And we remove the track from each of these playlists
//     listOfPlaylistsToClean.forEach((playlist: string) => {
//       this.removeTracksFromPlaylist(playlist, tracksToClean);
//     })
//   }


//   removeTracksFromPlaylist(playlistId: string, tracksToRemove: string[]) {
//     tracksToRemove.map((elem) => {
//       return { uri: elem };
//     })

//     this.httpService.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//       { params: { tracks: tracksToRemove } });
//   }

//   // TODO: Useless gateway?
//   getTracksFromId(jwt: SortifyJwt, tracksId: string[]){
//     this.httpService.get('https://api.spotify.com/v1/tracks',
//       {
//         params: { ids: tracksId },
//         headers: { Authorization: 'Bearer ' + jwt.spotify_token }
//       }
//     )
//   }
// }
