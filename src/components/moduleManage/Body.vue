<template>
  <div>
    <h1>模块打包工具</h1>
    <a href="javascript:;" @click="min">最小化</a>
  </div>
</template>

<style scoped>

</style>

<script>
  import { login } from '@/api';

  export default {
    data () {
      return {

      };
    },
    methods: {
      min () {
        console.log('hello');
      }
    },
    async created () {
      try {
        const user = await login('hello', '123456');
        console.log(user.data);
      } catch (err) {
        console.error(err);
      };
    }
  };
</script>