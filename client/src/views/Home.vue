<template>
  <div class="home">
    <h1>Vous êtes connecté, bravo !</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import apiService from '../services/sortify-api.service';


@Component({})
export default class Home extends Vue {
  currentUser: any;

  mounted(){
    apiService.getUserInfos().then(
      (response) => {
        console.log(response);
      }
    ).catch((error) => {
      console.log(error);
    });
  }

  setUser(user) {
    this.currentUser = user;
  }
  
}
</script>