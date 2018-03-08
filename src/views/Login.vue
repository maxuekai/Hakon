<template>
  <div>
    <div class="layout-body">
      <div class="layout-login">
        <div class="login-hd">
          <h1>HAKON</h1>
        </div>
        <div class="login-bd">
          <input type="text" placeholder="用户名" v-model="name">
          <input type="password" placeholder="密码" v-model="pwd">
          <button @click.enter="signIn">登录</button>
          <router-link class="register" to="/admin/register">注册</router-link>
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
}
.layout-login{
  width:400px;height:300px;
  background:#fff;
  position: absolute;left:50%;top:50%;
  transform:translate(-50%, -50%);
  box-sizing:border-box;
  padding:0 20px;
}
.layout-login .login-hd{
  height:100px;line-height:100px;
}
.layout-login .login-hd h1{
  font-size:24px;text-align:center;
}
.login-bd input{
  display: block;width:100%;height:30px;
  margin-bottom:25px;
  text-indent:10px;
}
.login-bd input:focus{
  outline-color:#eee;
}
.login-bd button{
  width:100%;height:40px;
  outline:none;border:none;
  background: #454545;
  color:#fff;
  cursor: pointer;
  transition:.2s;
}
.login-bd button:hover{
  background:#636363;
}
.login-bd button:active{
  transform:scale(.95);
}
.login-bd .register{
  font-size:14px;color:#454545;
  float: right;text-decoration:none;
  margin-top:10px;
  opacity:0.6;
  transition:.2s;
}
.login-bd .register:hover{
  opacity:1;
}
</style>

<script>
  import { login, checkLogin } from '@/api';
  export default {
    data () {
      return {
        name: '',
        pwd: ''
      };
    },
    methods: {
      async signIn () {
        try {
          const res = await login(this.name, this.pwd);
          console.log(res);
        } catch (err) {
          console.error(err);
        }
      }
    },
    async created () {
      try {
        const res = await checkLogin();
        console.log(res.data);
        if (res.data.code === 200) {
          this.$router.push('/admin/index');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
</script>