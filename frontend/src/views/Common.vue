<template>
    <div>
        <div class="layout-body">
            <div class="layout-aside">
                <module-nav></module-nav>
            </div>
            <div class="layout-main">
                <div class="layout-bar">
                    <module-bar></module-bar>
                </div>
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
    position: relative;
}
.layout-body .layout-main .layout-cont{
    flex: 1;
    background:#eeeeee;
    position: relative;
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