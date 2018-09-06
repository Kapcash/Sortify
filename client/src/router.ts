import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import PageNotFound from '@/views/PageNotFound.vue';
import authService from '@/services/auth.service';
import apiService from '@/services/sortify-api.service';

Vue.use(Router);

const sortifyRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        if (authService.isUserConnected()) {
          next();
        } else {
          next('/login');
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        // If coming from backend authentication
        if (to.query.jwt) {
          // We request the jwt token
          authService.storeJwt(to.query.jwt);
          next('/');
        } else if (to.query.error) {
          // TODO: Handle error jwt
        } else {
          if (authService.isUserConnected()) {
            next('/');
          } else {
            next();
          }
        }
      }
    },
    {
      path: '/pagenotfound',
      name: 'pagenotfound',
      component: PageNotFound,
    },
    {
      path: '*',
      redirect: '/pagenotfound',
    }
  ],
});

export default sortifyRouter;
