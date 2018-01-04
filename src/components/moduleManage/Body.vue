<template>
  <div>
    <div class="layout-main">
      <div class="layout-menu">
        <module-menu></module-menu>
      </div>
      <div class="layout-cont">
        <module-cont></module-cont>
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
  position: relative;
}
.layout-main .layout-cont{
  height:100%;width:calc(100vw - 180px - 65px);
  box-sizing:border-box;
  position: relative;
}
</style>

<script>
  import menu from '@/components/moduleManage/Menu';
  import cont from '@/components/moduleManage/Content';

  export default {
    components: {
      'module-menu': menu,
      'module-cont': cont
    }
  };
</script>