<template>
  <div>
    <div class="layout-main">
      <div class="layout-menu">
        <module-menu></module-menu>
      </div>
      <div class="layout-cont">

      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-main{
  display:flex;
}
.layout-main .layout-menu{
  width:180px;height:100%;
}
.layout-main .layout-cont{
  flex: 1;height:100%;
}
</style>

<script>
  import menu from '@/components/moduleManage/Menu';
  import { login } from '@/api';

  export default {
    components: {
      'module-menu': menu
    },
    data () {
      return {

      };
    },
    methods: {

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