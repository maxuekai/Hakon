<template>
  <div>
    <div class="layout-body">
      <div class="layout-manage">
        <div class="manage-hd">
          <h1>模块管理</h1>
          <a href="javascript:;" class="btn btn01">新增</a>
        </div>
        <div class="manage-bd">
          <ul>
            <li v-for="item in moduleList">
              <router-link class="module-name" :to="{ name: 'moduleList', params: { moduleId: item._id }}">{{item.name}}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-body{
  width:100vw;height:100vh;
  background:#454545;
  position: relative;
  box-sizing:border-box;padding-top:20px;
}
.layout-manage{
  width:80%;
  margin:0 auto;padding:10px 0;box-sizing:border-box;
  background: #ffffff;
}
.manage-hd{
  position: relative;
  margin:0 10px;
}
.manage-hd h1{
  font-size:16px;font-weight:normal;
}
.btn01{
  display: block;
  width:80px;height:24px;
  line-height:24px;text-align:center;
  background: #eeeeee;
  font-size:12px;color:#535353;
  text-decoration:none;
}
.btn01:hover{
  background:#454545;
  color:#fff;
}
.manage-hd .btn01{
  position: absolute;right:0;top:-3px;
}

.manage-bd{
  margin-top:20px;
}
.manage-bd ul li{
  width:96%;height:46px;line-height:46px;
  border-bottom:1px dashed #6e6e6e;
  color:#6e6e6e;
  margin:0 auto;
}
.manage-bd ul li:last-child{
  border-bottom:none;
}
.manage-bd ul li:hover{
  background:#454545;
  color:#fff;
}
.manage-bd li .module-name{
  font-size:14px;color:inherit;
  text-decoration:none;
  margin-left:10px;
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
            console.log(this.moduleList);
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