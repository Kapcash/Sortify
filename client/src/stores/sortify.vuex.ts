import { Module, VuexModule, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';
import store from './store';
import axios from 'axios';
import * as api from './sortify.api';
import * as _ from 'lodash';
import { AnyTxtRecord } from 'dns';

@Module({ dynamic: true, store, name: 'sortify' })
export class SortifyVuex extends VuexModule {
  public user: any = {};
  public playlists: any[] = [];
  public tracks: any[] = [];
  public upToDate: boolean = false;
  public playlistsFilter: string[] = [];

  public get playlistsFiltered() {
    if (this.playlistsFilter.length === 0) {
      return this.playlists;
    }
    return this.playlists.filter((pl) => this.playlistsFilter.indexOf(pl._id) >= 0);
  }

  @Mutation
  public async setPlaylistFilter(currentPlaylists: string[]): Promise<any> {
    this.playlistsFilter = currentPlaylists;
  }

  @MutationAction
  public async getUnsortedTracks(): Promise<any> {
    const response = await api.unsortedTracks(this.state.user);
    return { tracks: response.data };
  }

  @MutationAction
  public async getPlaylists(): Promise<any> {
    try {
      const response = await axios.post('/spotify/playlists', { user: this.state.user });
      return { playlists: response.data };
    } catch (e) {
      // TODO handle error
    }
  }

  @MutationAction
  public async getTracksByPlaylist(playlistId: string): Promise<any> {
    try {
      const response = await axios.post(`/spotify/tracks?playlistId=${playlistId}`, { user: this.state.user });
      return { tracks: response.data };
    } catch (e) {
      // TODO handle error
    }
  }

  @MutationAction({ mutate: ['user'] })
  public async getUserInfos() {
      const response = await axios.get('/spotify/me');
      return { user: response.data };
  }

  @Mutation
  public setTracks(tracks: any[]) {
    this.tracks = tracks;
  }

  @Action({ commit: 'setTracks' })
  public resetTracks() {
    return [];
  }

  @Mutation
  public isUpToDate(upToDate: boolean) {
    this.upToDate = upToDate;
  }

  @Action({ commit: 'isUpToDate' })
  public loading() {
    return true;
  }

  @Action({ commit: 'isUpToDate' })
  public doneLoading() {
    return false;
  }
}

export default getModule(SortifyVuex);
