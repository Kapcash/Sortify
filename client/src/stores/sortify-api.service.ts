import axios from 'axios';

class SortifyApiService  {

  /** List of personal user's playlists (id) */
  public userPlaylist: string[] = [];
  /** List of all saved tracks in the user's library (id) */
  public savedTracks: string[]  = [];
  /** List of all sorted tracks stored by <track id, list of playlist containing the track> */
  public sortedTracks: any[] = [];
  /** List of all tracks in the special 'sortify-trash' playlist (id) */
  public sortifyTrashPlaylist: string[]  = [];

  public currentTracks: any[] = [];
  public playlists: any[] = [];

  public getUserInfos(): any {
    return axios.get('/spotify/me');
  }

  public initializeApp(user): any {
    return axios.post('/spotify/init', {user}).then(
      (response) => {
        this.userPlaylist = response.data.userPlaylist;
        this.savedTracks = response.data.savedTracks;
        this.sortedTracks = response.data.sortedTracks;
        return response.data;
      }
    ).catch((error) => {
      console.log(error);
    });
  }

  public getUnsortedTracks(): any {
    return axios.post('/spotify/unsorted-tracks', {sortedTracks: this.sortedTracks, savedTracks: this.savedTracks});
  }

  public getPlaylists(user): any {
    return axios.post('/spotify/playlists', {user});
  }

  public getTracksByPlaylist(playlistId: string, user): any {
    return axios.post(`/spotify/tracks?playlistId=${playlistId}`, {user});
  }

}

export default new SortifyApiService();
