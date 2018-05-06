<template>
  <div>
    <div class="layout-body">
      <div class="layout-edit">
        <div class="edit-hd">
          <input type="text" v-model="name" placeholder="模板名称">
        </div>
        <div class="edit-bd">
          <div class="bd-item bd-category">
            <h3>类别</h3>
            <input type="text" v-model.trim="category" placeholder="类别">
            <select name="category" v-model.trim="category">
              <option v-for="item in categoryList" :key="item">{{ item }}</option>
            </select>
          </div>
          <div class="bd-item bd-html">
            <h3>html</h3>
            <textarea name="html" v-model="html"></textarea>
          </div>
          <div class="bd-item bd-css">
            <h3>css</h3>
            <textarea name="css" v-model="css"></textarea>
          </div>
          <div class="bd-item bd-js">
            <h3>js</h3>
            <textarea name="js" v-model="js"></textarea>
          </div>
        </div>
        <div class="edit-fd">
          <button class="btn" @click="back">返回</button>
          <button class="btn" @click="upload">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-body{
  width:100vw;
  background:#454545;
  position: relative;
  box-sizing:border-box;padding:20px 0;
}
.layout-edit{
  width:80%;
  margin:0 auto;padding:20px 24px 20px;box-sizing:border-box;
  background: #ffffff;
}
.edit-hd{
  position: relative;
}
.edit-hd input[type=text]{
  width:100%;
  font-size:16px;font-weight:normal;
  padding-bottom:10px;
  border:none;
  border-bottom:1px solid #cccccc;
  margin-bottom:20px;
  outline:none;
}
.edit-bd .bd-item{
  margin-bottom:20px;
  width:100%;
}
.edit-bd .bd-item h3{
  font-size:14px;font-weight:normal;
  margin-bottom:10px;
}
.edit-bd .bd-item textarea{
  width:100%;height:100px;
  box-sizing:border-box;
  resize:none;
}
.edit-bd .bd-item textarea:focus{
  outline-color: #cccccc;
}

.edit-fd .btn{
  display: inline-block;vertical-align:middle;
  width:80px;height:24px;
  line-height:24px;text-align:center;
  background: #eeeeee;
  font-size:12px;color:#535353;
  text-decoration:none;
  cursor: pointer;
  border:none;outline:none;
  margin-right:10px;
}
.edit-fd .btn:hover{
  background:#454545;
  color:#fff;
}
</style>

<script>
  import { getModule, getAllCategory, uploadCode, updateCode } from '@/api';
  export default {
    data () {
      return {
        id: '',
        name: '',
        category: '',
        html: '',
        css: '',
        js: '',
        categoryList: []
      };
    },
    methods: {
      async fetchData (id) {
        try {
          const res = await getModule(id);
          if (res.data.code === 200) {
            const data = res.data.data;
            this.name = data.name;
            this.category = data.category;
            this.html = data.html;
            this.css = data.css;
            this.js = data.js;
          }
        } catch (err) {
          console.error(err);
        }
      },
      async fetchCategory () {
        try {
          const res = await getAllCategory();
          if (res) {
            this.categoryList = res.data.data;
          }
        } catch (err) {
          console.error(err);
        }
      },
      async upload () {
        try {
          let res;
          if (this.id) {
            res = await updateCode(this.id, this.name, this.html, this.css, this.js, this.category);
          } else {
            res = await uploadCode(this.name, this.html, this.css, this.js, this.category);
          }
          if (res.data.code === 200) {
            alert('保存成功');
            this.back();
          } else {
            alert('保存失败');
          }
        } catch (err) {
          console.error(err);
        }
      },
      // async update () {
      //   try {
      //     const res = await updateCode(this.id, this.name, this.html, this.css, this.js, this.category);
      //     console.log(res);
      //     if (res.data.code === 200) {
      //       alert('保存成功');
      //       this.back();
      //     } else {
      //       alert('保存失败');
      //     }
      //   } catch (err) {
      //     console.error(err);
      //   }
      // },
      back () {
        this.$router.go(-1);
      }
    },
    created () {
      this.id = this.$route.params.moduleId;
      if (this.id) {
        this.fetchData(this.id);
      }
      this.fetchCategory();
    }
  };
</script>