<template>
  <div class="playlist" :class="{ selected: selected }" @click="getTracks()">
    <span class="plName">{{playlist.name}}</span>
    <span class="nbtrack">{{$t('nbTrack')}} {{playlist.tracks.length}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SortifyVuex from '../stores/sortify.vuex';

@Component({name: 'item-playlist'})
export default class ItemPlaylist extends Vue {
  @Prop() public playlist: any;
  @Prop() public selected: boolean;

  public getTracks() {
    if (this.selected) {
      SortifyVuex.resetTracks();
    } else {
      SortifyVuex.getTracksByPlaylist(this.playlist._id);
    }
  }
}
</script>

<style lang="scss">
$selectedBackground: rgba(255, 197, 0, 0.2);

.playlist {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  white-space: nowrap;
  padding: 7px 11px;
  border-bottom: 1px solid #cacaca;
  &:hover {
    background-color: $selectedBackground;
    cursor: pointer;
  }
}

.selected {
    background-color: $selectedBackground;
    cursor: pointer;
}

.plName {
  font-weight: 800;
  text-overflow: ellipsis;
  overflow-x: hidden;
}

.nbtrack {
  text-overflow: ellipsis;
  overflow-x: hidden;
}
</style>

<i18n>
{
  "en": {
    "nbTrack": "Number of tracks:"
  },
  "fr": {
    "nbTrack": "Nombre de morceaux :"
  }
}
</i18n>
