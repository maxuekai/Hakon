import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: resolve => require(['@/views/Index'], resolve)
    },
    {
      path: '*',
      component: resolve => require(['@/views/404'], resolve)
    }
  ]
});
