import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    component: resolve => require(['@/views/Common'], resolve),
    children: [{
      path: '/index/',
      component: resolve => require(['@/views/Index'], resolve)
    },
    {
      path: '/moduleManageTool/',
      component: resolve => require(['@/views/ModuleManage'], resolve),
      children: [{
        path: '/moduleManageTool/:moduleId',
        name: 'moduleList',
        component: resolve => require(['@/views/ModuleManage'], resolve)
      }]
    },
    {
      path: '*',
      component: resolve => require(['@/views/404'], resolve)
    }
    ]
  },
  {
    path: '*',
    component: resolve => require(['@/views/404'], resolve)
  }
  ]
});
