<template>
  <div class="home">
    <h1>Vous êtes connecté, bravo !</h1>
    {{currentUser.displayName}}
    {{currentUser.id}}
    <img v-bind:src="currentUser.imageLink">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import apiService from '../services/sortify-api.service';


@Component({})
export default class Home extends Vue {
  public currentUser: any = {};

  private mounted() {
    apiService.getUserInfos().then(
      (response) => {
        this.currentUser = response.data;
      }
    ).catch((error) => {
      console.log(error);
    });
  }

}
</script>