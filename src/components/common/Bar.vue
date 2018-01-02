<template>
    <div>
        <div class="handle-bar">
            <ul>
                <li><a href="javascript:;" @click="min">最小化</a></li>
                <li><a href="javascript:;" @click="max">最大化</a></li>
                <li><a href="javascript:;" @click="close">关闭</a></li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.handle-bar{
    display: block;
    width:100%;height:40px;
    background: #ccc;
    -webkit-app-region: drag;
}
.handle-bar ul{
    text-align: right;
    font-size:0;
}
.handle-bar ul li{
    display: inline-block;
    width:60px;height:40xp;
    line-height:40px;text-align:center;
    -webkit-app-region: no-drag;
}
.handle-bar ul li a{
    font-size:14px;
    color:#000;
    text-decoration: none;
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