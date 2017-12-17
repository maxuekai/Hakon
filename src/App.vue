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
</style>
