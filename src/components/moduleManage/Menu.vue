<template>
  <div>
    <div class="layout-act">
      <a href="javascript:;" class="refresh" @click="fetchdata"></a>
      <a href="javascript:;" class="manage" @click="upload"></a>
    </div>
    <div class="module-list">
      <div class="module-item" v-for="(value, key) in moduleList" :key="key">
        <a href="javascript:;" class="category" @click="value.show = !value.show">{{ key }}</a>
        <ul class="item-list" v-show="value.show">
          <li v-for="item in value.data" :key="item._id">
            <router-link :to="{ name: 'moduleList', params: { moduleId: item._id }}">{{item.name}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.module-list{
  height:calc(100vh - 100px);
  overflow: auto;
}
.module-list .category{
  display: block;
  width:100%;height:34px;
  line-height:34px;
  font-size:14px;color:#ffffff;
  text-indent:20px;cursor: pointer;
  background:#454545;
  text-decoration:none;
}
.module-list .category:hover{
  opacity:0.9;
}
.module-list ul li{
  width:100%;height:34px;
  line-height:34px;
  font-size:14px;color:#6e6e6e;
  text-indent:35px;cursor: pointer;
}
.module-list ul li a{
  display: block;
  width:100%;height:100%;
  font-size:14px;color:#6e6e6e;
  text-decoration: none;
}
.module-list ul li:hover a,.module-list ul li a.router-link-exact-active{
  background: #454545;
  color:#ffffff;
}
.layout-act{
  text-align:right;font-size:0;
  padding-right:5px;
  margin-bottom:10px;
}
.layout-act a{
  display: inline-block;vertical-align: middle;
  width:20px;height:20px;
  margin:0 10px;
  transition:.3s;
}
.layout-act a:hover{
  transform:rotate(180deg);
}
.layout-act .refresh{
  background-image:url(~img/icon-refresh.png)
}
.layout-act .manage{
  background-image:url(~img/icon-manage.png);
}
</style>

<script>
  import { getAllModules } from '@/api';
  const {ipcRenderer: ipc} = global.require('electron');

  export default {
    data () {
      return {
        moduleList: {}
      };
    },
    methods: {
      async fetchdata () {
        try {
          const res = await getAllModules();
          let moduleList = {};
          if (res.data.code === 200) {
            let data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              if (data[i].category in moduleList) {
                moduleList[data[i].category]['data'].push(data[i]);
              } else {
                moduleList[data[i].category] = {};
                moduleList[data[i].category]['data'] = [];
                moduleList[data[i].category]['data'].push(data[i]);
                moduleList[data[i].category]['show'] = true;
              }
            }
            this.moduleList = moduleList;
            console.log(this.moduleList);
          } else {
            console.error('error');
          }
        } catch (err) {
          console.error(err);
        };
      },
      upload () {
        ipc.send('webview');
      }
    },
    created () {
      this.fetchdata();
    }
  };
</script>