<template>
    <div>
        <div class="handle-bar">
            <ul>
                <li @click="min"><a href="javascript:;" class="icon-min">最小化</a></li>
                <li @click="max"><a href="javascript:;" class="icon-max">最大化</a></li>
                <li @click="close"><a href="javascript:;" class="icon-close">关闭</a></li>
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
    cursor: pointer;
}
.handle-bar ul li:hover{
    background:rgba(165, 165, 165, 0.5);
}
.handle-bar ul li a{
    display:inline-flex;
    width:12px;height:12px;
    justify-content: center;align-items:center;
}
.handle-bar ul li .icon-min{
    background:url(~img/icon-min.png);
}
.handle-bar ul li .icon-max{
    background:url(~img/icon-max.png);
}
.handle-bar ul li .icon-close{
    background:url(~img/icon-close.png);
}
</style>

<script>
// 唤起客户端功能
const ipc = global.require('electron').ipcRenderer;

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