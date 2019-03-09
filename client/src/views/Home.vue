<template>
  <div class="home">
    <h1>Vous êtes connecté, bravo !</h1>

    <h1>{{loading}}</h1>

    {{currentUser.displayName}}
    <img v-bind:src="currentUser.imageUrl">

    <ul><li v-for="pl in playlists" :key="pl._id">{{pl.name}}</li></ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import apiService from '../services/sortify-api.service';

@Component({})
export default class Home extends Vue {
  public currentUser: any = {};
  public loading: boolean = true;
  public playlists: any[] = [];

  private mounted() {
    apiService.getUserInfos().then((userResponse) => {
      this.currentUser = userResponse.data;
      apiService.initializeApp(this.currentUser).then((initResponse) => {
        this.loading = false;
        apiService.getPlaylists(this.currentUser).then((playlists) => this.playlists = playlists.data);
        // apiService.getUnsortedTracks().then((unsortedTracks) => {
        // }).catch((error) => {
        //   this.loading = false;
        // });
      }).catch((error) => {
        this.loading = false;
      });
    }).catch((error) => {
      console.log(error);
    });
  }
}
</script>