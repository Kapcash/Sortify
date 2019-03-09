<template>
  <div>
    {{$t('hello')}}
    <ul>
      <li v-for="elem in elements" :key="elem.id">
        <slot :elem="elem"></slot> <!-- Transcluding elements -->
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
  ul {
    list-style: none;
  }
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({name: 'col-list'})
export default class ColList<T> extends Vue {
  @Prop() public elements: T[] = [];
}
</script>

<i18n>
{
  "en": {
    "hello": "Column"
  },
  "fr": {
    "hello": "Colonne"
  }
}
</i18n>
