<template>
    <div>
        <div class="handle-bar">
            <ul>
                <li><a href="javascript:;" class="icon-min" @click="min">最小化</a></li>
                <li><a href="javascript:;" class="icon-max" @click="max">最大化</a></li>
                <li><a href="javascript:;" class="icon-close" @click="close">关闭</a></li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.handle-bar{
    display: block;
    width:100%;height:50px;
    -webkit-app-region: drag;
}
.handle-bar ul{
    text-align: right;
    font-size:0;
}
.handle-bar ul li{
    display: inline-block;
    width:60px;height:50px;
    line-height:50px;text-align:center;
    -webkit-app-region: no-drag;
}
.handle-bar ul li a{
    display:inline-flex;
    width:12px;height:12px;
    justify-content: center;align-items:center;
}
.handle-bar ul li .icon-min{
    background:url(/src/assets/img/icon-min.png);
}
.handle-bar ul li .icon-max{
    background:url(/src/assets/img/icon-max.png);
}
.handle-bar ul li .icon-close{
    background:url(/src/assets/img/icon-close.png);
}
</style>

<script>
const {ipcRenderer: ipc} = global.require('electron');

export default {
  methods: {
    min () {
      ipc.send('min');
    },
    max () {
      ipc.send('max');
    },
    close () {
      ipc.send('close');
    }
  }
};
</script>