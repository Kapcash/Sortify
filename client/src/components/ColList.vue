<template>
  <div class="col">
    <div class="element" v-for="elem in elementsWithId" :key="elem._id" v-on:click="selectItem(elem._id)">
      <slot :elem="elem" :selected="isSelected(elem)"></slot> <!-- Transcluding elements -->
    </div>
    <div v-show="elementsWithId.length === 0">
      TODO: Image for empty list
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Item } from '../../../shared/models/item.model';

@Component({name: 'col-list'})
export default class ColList<T extends Item> extends Vue {
  @Prop() public elements: T[];
  public selectedElem: string = '';

  public get elementsWithId(): T[] {
    return this.elements ? this.elements.filter((elem: T) => !!elem._id) : [];
  }

  isSelected(elem: T) {
    return elem._id === this.selectedElem;
  }

  public selectItem(elemId: string) {
    this.selectedElem = this.selectedElem === elemId ? '' : elemId;
  }
}
</script>

<style lang="scss">
  .col {
    flex: 1;
    overflow-y: scroll;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    background-color: #f3f3f3;
    box-shadow: -2px 0px 5px 0px #8c8c8c6b;
    z-index: 100;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent; 
    }
    &::-webkit-scrollbar-thumb {
      background: #91df97;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #3acc4d; 
    }
  }
</style>
