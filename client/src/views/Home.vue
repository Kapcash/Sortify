<template>
  <div class="home">
    <div class="main">
      <h1>Vous êtes connecté, bravo !</h1>
      <h1>{{loading}}</h1>
      {{currentUser.displayName}}
      <img class="pp" v-bind:src="currentUser.imageUrl">
    </div>
    <div class="col"><col-list v-bind:elements="playlists"><item-playlist slot-scope="s" v-bind:playlist="s.elem"></item-playlist></col-list></div>
    <div class="col"><col-list v-bind:elements="tracks"><item-track  slot-scope="s" v-bind:track="s.elem"></item-track></col-list></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ColList from '@/components/ColList.vue'
import ItemPlaylist from '@/components/ItemPlaylist.vue'
import ItemTrack from '@/components/ItemTrack.vue'
import apiService from '../services/sortify-api.service';

@Component({
  components: { ColList, ItemPlaylist, ItemTrack }
})
export default class Home2 extends Vue {
  public currentUser: any = {};
  public loading: boolean = true;
  public playlists: any[] = [];

  public tracks = [
    { id: 1, message: 'track1'},
    { id: 2, message: 'track2'},
  ];

  private async mounted() {
    try {
      // TODO Only if jwt out of date, else get infos from jwt
      const userResponse = await apiService.getUserInfos();
      this.currentUser = userResponse.data;
      await apiService.initializeApp(this.currentUser);
      this.loading = false;
      const playlists = await apiService.getPlaylists(this.currentUser);
      this.playlists = playlists.data;
    } catch (error) {
      this.loading = false;
    };
  }
}
</script>

<style lang="scss">
  .home {
    height: 100%;
    display: flex;
    flex-direction: row;
  }
  .main {
    flex: 3 0 auto;
    display: flex;
    flex-direction: column
  }
  .col {
    flex: 1 0 auto;
    display: flex;
    background-color: #f3f3f3;
    box-shadow: -2px 0px 5px 0px #8c8c8c6b;
    z-index: 100;
  }
  .pp{
    width: 75px;
  }
</style>