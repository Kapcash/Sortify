<template>
  <div class="home">
    <div class="main">
      <h1>Vous êtes connecté, bravo !</h1>
      <h1>{{isLoading}}</h1>
      {{user.displayName}}
      <img class="pp" v-bind:src="user.imageUrl">
      <button @click="getUnsortedTracks">Unsorted tracks</button>
    </div>
    <col-list v-bind:elements="playlists">
      <item-playlist slot-scope="s" v-bind:playlist="s.elem" v-bind:selected="s.selected"></item-playlist>
    </col-list>
    <col-list v-bind:elements="tracks">
      <item-track slot-scope="s" v-bind:track="s.elem" v-bind:selected="s.selected"></item-track>
    </col-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ColList from '@/components/ColList.vue';
import ItemPlaylist from '@/components/ItemPlaylist.vue';
import ItemTrack from '@/components/ItemTrack.vue';
import SortifyVuex from '../stores/sortify.vuex';
import { initializeApp } from '../stores/sortify.api';

@Component({
  components: { ColList, ItemPlaylist, ItemTrack }
})
export default class Home extends Vue {

  private async mounted() {
    // TODO Only if jwt out of date, else get infos from jwt
    SortifyVuex.loading();
    await SortifyVuex.getUserInfos();
    await initializeApp(this.user);
    await SortifyVuex.getPlaylists();
    SortifyVuex.doneLoading();
  }

  public getUnsortedTracks() {
    SortifyVuex.getUnsortedTracks();
  }

  get playlists() {
    return SortifyVuex.playlistsFiltered;
  }

  get tracks() {
    return SortifyVuex.tracks;
  }

  get isLoading() {
    return SortifyVuex.upToDate;
  }

  get user() {
    return SortifyVuex.user;
  }
}
</script>

<style lang="scss">
  .home {
    height: 100%;
    display: flex;
    flex-direction: row;
    font-family: 'Montserrat', sans-serif;
  }
  .main {
    flex: 3;
  }
  .pp{
    width: 75px;
  }
</style>