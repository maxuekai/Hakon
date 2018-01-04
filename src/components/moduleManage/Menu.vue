<template>
  <div>
    <div class="menu-list">
      <ul>
        <li v-for="item in moduleList">
          <router-link :to="{ name: 'moduleList', params: { moduleId: item._id }}">{{item.name}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.menu-list{
  height:calc(100vh - 50px);
}
.menu-list ul li{
  width:100%;height:34px;
  line-height:34px;
  font-size:14px;color:#6e6e6e;
  text-indent:35px;cursor: pointer;
}
.menu-list ul li a{
  display: block;
  width:100%;height:100%;
  font-size:14px;color:#6e6e6e;
  text-decoration: none;
}
.menu-list ul li:hover a,.menu-list ul li a.router-link-exact-active{
  background: #454545;
  color:#ffffff;
}
</style>

<script>
  import { getAllModules } from '@/api';

  export default {
    data () {
      return {
        moduleList: []
      };
    },
    methods: {
      async fetchdata () {
        try {
          const res = await getAllModules();
          if (res.data.code === 200) {
            this.moduleList = res.data.data;
          } else {
            console.error('error');
          }
        } catch (err) {
          console.error(err);
        };
      }
    },
    created () {
      this.fetchdata();
    }
  };
</script>