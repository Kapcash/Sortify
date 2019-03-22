<template>
  <div class="track" :class="{ selected: selected }" @click="getPlaylists()">
    <span class="trName">{{track.name}}</span>
    <span class="artists">{{track.artists.map(a => a.name).join(', ')}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SortifyVuex from '../stores/sortify.vuex';

@Component({name: 'item-track'})
export default class ItemTrack extends Vue {
  @Prop() public track: any;
  @Prop() public selected: boolean;

  getPlaylists() {
    let playlistsFilter = this.track.playlists;
    // If already selected, then we reset the filter + selection
    if (this.selected) {
      playlistsFilter = [];
    }
    SortifyVuex.setPlaylistFilter(playlistsFilter);
  }
}
</script>

<style lang="scss">
$selectedBackground: rgba(255, 197, 0, 0.2);

.track {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  white-space: nowrap;
  padding: 5px 11px;
  border-bottom: 1px solid #cacaca;
  &:hover {
    background-color: $selectedBackground;
    cursor: pointer;
  }
  
  .trName {
    font-weight: 800;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }

  .artists {
    text-overflow: ellipsis;
    overflow-x: hidden;
  }
}

.selected{
  background-color: $selectedBackground;
  cursor: pointer;
}
</style>
