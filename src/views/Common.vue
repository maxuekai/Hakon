<template>
    <div>
        <div class="layout-body">
            <div class="layout-aside">
                <module-nav></module-nav>
            </div>
            <div class="layout-main">
                <divy class="layout-bar">
                    <module-bar></module-bar>
                </divy>
                <div class="layout-cont">
                    <router-view></router-view>
                </div>
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
    width:65px;
}
.layout-body .layout-main{
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction:column;
}
.layout-body .layout-main .layout-bar{
    height:50px;
    background:#eeeeee;
}
.layout-body .layout-main .layout-cont{
    flex: 1;
    background:#eeeeee;
}
</style>

<script>
import nav from '@/components/common/Nav';
import bar from '@/components/common/Bar';
export default {
  name: 'common',
  components: {
    'module-nav': nav,
    'module-bar': bar
  }
};
</script>