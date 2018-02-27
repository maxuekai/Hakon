<template>
  <div>
    <div class="layout-body">
      <div class="layout-manage">
        <div class="manage-hd">
          <h1>模块管理</h1>
          <router-link class="btn btn01" :to="{ name: 'edit' }">新增</router-link>
        </div>
        <div class="manage-bd">
          <ul>
            <li v-for="item in moduleList">
              <p class="module-name">{{item.name}}</p>
              <div class="module-act">
                <router-link title="编辑" class="icon icon-edit" :to="{ name: 'edit', params: { moduleId: item._id } }"></router-link>
                <a href="javascript:;" title="删除" class="icon icon-del" @click="deleteData(item.name, item._id)"></a>
              </div>
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
  position: relative;
}
.manage-bd ul li:last-child{
  border-bottom:none;
}
/* .manage-bd ul li:hover{
  background:#454545;
  color:#fff;
} */
.manage-bd li .module-name{
  font-size:14px;color:inherit;
  text-decoration:none;
  margin-left:10px;
}
.manage-bd li .module-act{
  display:none;
  position: absolute;left:0;right:0;top:0;bottom:0;
  background:#454545;
}
.manage-bd ul li:hover .module-act{
  display:block;
}
.manage-bd .module-act .icon{
  display: inline-block;vertical-align:-3px;
  width:16px;height:16px;
  margin-left:20px;
}
.icon-del{
  background:url(/src/assets/img/icon-delete.png);
}
.icon-edit{
  background:url(/src/assets/img/icon-edit.png)
}
</style>

<script>
  import { getAllModules, deleteModule } from '@/api';

  export default {
    data () {
      return {
        moduleList: []
      };
    },
    methods: {
      async fetchData () {
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
      },
      async deleteData (name, _id) {
        let confirm = window.confirm('确认删除模板：' + name + '?');
        if (confirm) {
          try {
            const res = await deleteModule(_id);
            if (res.data.code === 200) {
              alert('删除成功');
              this.fetchData();
            } else {
              alert('删除失败');
              console.error('error');
            }
          } catch (err) {
            alert('删除失败');
            console.error(err);
          };
        }
      }
    },
    created () {
      this.fetchData();
    }
  };
</script>