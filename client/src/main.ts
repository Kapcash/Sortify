import Vue from 'vue';
import App from './App.vue';
import Router from './router';
import i18n from './i18n';
import Vuex, { StoreOptions } from 'vuex';
import store from './stores/store';

Vue.config.productionTip = false;

Vue.use(Vuex);

new Vue({
  router: Router,
  store,
  i18n,
  render: (h) => h(App, {})
}).$mount('#sortifyApp');
