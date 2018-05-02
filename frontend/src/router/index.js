import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/admin',
    component: resolve => require(['@/views/Admin'], resolve),
    children: [
      {
        path: '/admin/index',
        component: resolve => require(['@/components/admin/Manage'], resolve)
      },
      {
        path: '/admin/edit/:moduleId?',
        name: 'edit',
        component: resolve => require(['@/components/admin/Edit'], resolve)
      },
      {
        path: '/admin/login',
        component: resolve => require(['@/views/Login'], resolve)
      },
      {
        path: '/admin/register',
        component: resolve => require(['@/views/Register'], resolve)
      }]
  },
  {
    path: '/',
    component: resolve => require(['@/views/Common'], resolve),
    children: [{
      path: '/index',
      component: resolve => require(['@/views/Index'], resolve)
    },
    {
      path: '/moduleManageTool',
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
    }]
  },
  {
    path: '*',
    component: resolve => require(['@/views/404'], resolve)
  }
  ]
});
