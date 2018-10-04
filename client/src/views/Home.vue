<template>
  <div class="home">
    <h1>Vous êtes connecté, bravo !</h1>

    <h1>{{loading}}</h1>

    {{currentUser.displayName}}
    {{currentUser.id}}
    <img v-bind:src="currentUser.imageLink">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import apiService from '../services/sortify-api.service';
import { noop } from 'vue-class-component/lib/util';

@Component({})
export default class Home extends Vue {
  public currentUser: any = {};
  public loading: boolean = true;

  private mounted() {
    apiService.getUserInfos().then(
      (userResponse) => {
        this.currentUser = userResponse.data;
        apiService.initializeApp(this.currentUser).then((initResponse) => {
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
        });
      }
    ).catch((error) => {
      console.log(error);
    });

  }

}
</script>