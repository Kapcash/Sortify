<template>
  <div class="login">
    <img src="../assets/logo.png">
    <button @click="connect">Se connecter à Spotify</button>
    <strong>{{error}}</strong>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Login extends Vue {
  private static readonly spotifyAuthUrl = 'http://localhost:3000/connect';
  public error: string = '';

  private mounted() {
    if(this.$route.query.error){
      this.error = this.$route.query.error;
    }
  }

  public connect() {
    window.location.href = Login.spotifyAuthUrl;
  }
}
</script>
