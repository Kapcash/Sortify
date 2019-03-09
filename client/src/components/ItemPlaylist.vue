<template>
  <p>
    {{playlist.name}}
  </p>
</template>

<style lang="scss">
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({name: 'item-playlist'})
export default class ItemPlaylist extends Vue {
  @Prop() public playlist: any;
}
</script>