import Vue from 'vue';
import Vuex from 'vuex';
import { SortifyVuex } from './sortify.vuex';

Vue.use(Vuex);

/**
 * Declare all VueX stores modules
 */
export interface IRootState {
  sortify: SortifyVuex;
}

export default new Vuex.Store<IRootState>({});
