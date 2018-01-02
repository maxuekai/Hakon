<template>
    <div>
        <div class="layout-body">
            <div class="layout-aside">
                <module-nav></module-nav>
            </div>
            <div class="layout-main">
                <module-bar></module-bar>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-body{
    display: flex;
    overflow: hidden;
    width:100vw;height: 100vh;
}
.layout-body .layout-aside{
    flex: 1;
}
.layout-body .layout-main{
    flex: 5;
    overflow: hidden;
}
</style>

<script>
import nav from '@/components/common/Nav';
import bar from '@/components/common/Bar';
export default {
  components: {
    'module-nav': nav,
    'module-bar': bar
  }
};
</script>