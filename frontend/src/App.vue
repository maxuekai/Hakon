<template>
  <div id="app" @drop.prevent @dragLave.prevent @dragenter.prevent @dragover.prevent>
    <router-view></router-view>
  </div>
  
</template>

<script>
export default {
  name: 'app'
};
</script>

<style>
@import 'assets/css/reset.css';
/* 设置滚动条的样式 */
::-webkit-scrollbar-track-piece{
  width:6px;background-color:rgba(0,0,0,0);
  display:none;
}
::-webkit-scrollbar{
  width:6px;height:6px;background:rgba(0,0,0,0);
}
::-webkit-scrollbar-thumb{
  width:6px;height:6px;background:#666;cursor:pointer;
}
</style>
