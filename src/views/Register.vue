<template>
  <div>
    <div class="layout-body">
      <div class="layout-register">
        <div class="register-hd">
          <h1>HAKON</h1>
        </div>
        <div class="register-bd">
          <input type="text" placeholder="用户名" v-model="name">
          <input type="password" placeholder="密码" v-model="pwd">
          <button @click.enter="signUp">注册</button>
          <router-link class="login" to="/admin/login">登录</router-link>
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
.layout-register{
  width:400px;height:300px;
  background:#fff;
  position: absolute;left:50%;top:50%;
  transform:translate(-50%, -50%);
  box-sizing:border-box;
  padding:0 20px;
}
.layout-register .register-hd{
  height:100px;line-height:100px;
}
.layout-register .register-hd h1{
  font-size:24px;text-align:center;
}
.register-bd input{
  display: block;width:100%;height:30px;
  margin-bottom:25px;
  text-indent:10px;
}
.register-bd input:focus{
  outline-color:#eee;
}
.register-bd button{
  width:100%;height:40px;
  outline:none;border:none;
  background: #454545;
  color:#fff;
  cursor: pointer;
  transition:.2s;
}
.register-bd button:hover{
  background:#636363;
}
.register-bd button:active{
  transform:scale(.95);
}
.register-bd .login{
  font-size:14px;color:#454545;
  float: right;text-decoration:none;
  margin-top:10px;
  opacity:0.6;
  transition:.2s;
}
.register-bd .login:hover{
  opacity:1;
}
</style>

<script>
  import { register, checkLogin } from '@/api';
  // const electron = global.require('electron');

  export default {
    data () {
      return {
        name: '',
        pwd: ''
      };
    },
    methods: {
      async signUp () {
        try {
          const res = await register(this.name, this.pwd);
          // const session = electron.remote.getCurrentWindow().webContents.session;
          // session.cookies.get({url: 'http://127.0.0.1:3600/api/inline/user/register'}, (error, cookies) => {
          //   console.log(error, cookies);
          // });
          if (res.data.code === 200) {
            alert('注册成功');
            this.$router.push('/admin/index');
          } else {
            alert('用户名或密码出错');
          }
        } catch (err) {
          console.error(err);
          alert('网络异常，请稍后重试');
        }
      }
    },
    async created () {
      try {
        const res = await checkLogin();
        if (res.data.code === 200) {
          this.$router.push('/admin/index');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
</script>