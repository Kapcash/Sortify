<template>
  <div class="login">
    <img src="../assets/logo.png">
    <button v-on:click="connect">Se connecter à Spotify</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Login extends Vue {
  private static readonly spotifyAuthUrl = 'http://localhost:3000/connect';

  public connect() {
    window.location.href = Login.spotifyAuthUrl;
  }
}
</script>
