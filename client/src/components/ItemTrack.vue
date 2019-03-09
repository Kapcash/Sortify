<template>
  <p>
    {{track.message}}
  </p>
</template>

<style lang="scss">
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({name: 'item-track'})
export default class ItemTrack extends Vue {
  @Prop() public track: any;
}
</script>