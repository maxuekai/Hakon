<template>
    <div>
        <div class="layout-body">
            <div class="wp-menu">
                <div class="menu-options">
                    <ul>
                        <li>
                            <input id="sprite" type="checkbox" class="option" v-model="mode.spriteRemMode">
                            <label for="sprite">雪碧图rem模式</label>
                        </li>
                        <li>
                            <input id="imgQuant" type="checkbox" class="option" v-model="mode.imgQuant">
                            <label for="imgQuant">压缩图片</label>
                        </li>
                        <li>
                            <input id="cssnext" type="checkbox" class="option" value="cssnext" v-model="mode.plugins">
                            <label for="cssnext">使用最新css</label>
                        </li>
                        <li>
                            <input id="autoprefixer" type="checkbox" class="option" value="autoprefixer" v-model="mode.plugins">
                            <label for="autoprefixer">自动加前缀功能</label>
                        </li>
                        <li>
                            <input id="cssnano" type="checkbox" class="option" value="cssnano" v-model="mode.plugins">
                            <label for="cssnano">压缩css</label>
                        </li>
                        <li>
                            <input id="import" type="checkbox" class="option" value="@import" v-model="mode.plugins">
                            <label for="import">处理@import文件</label>
                        </li>
                    </ul>
                </div>
                <div class="menu-address">
                    <h3>保存到</h3>
                    <div class="local">
                        <input id="local" type="checkbox" value="local" checked>
                        <label for="local">本地</label>
                    </div>
                </div>
            </div>
            <div class="wp-drag">
                <div class="drag-main" v-bind:class=" {'drop-hover': dropHover} " @dragover.prevent="dropHover = true" @drop.prevent="drop">
                    <p>将文件拖拽到此区域</p>
                </div>
                <div class="drag-log">
                    <p v-for="item in tips" v-bind:class="item.type">
                        {{ item.txt }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-body{
    display:flex;
    height:calc(100vh - 50px);
}
.layout-body .wp-drag{
    flex:1;height:100%;
    border-right:1px solid #CDCDCD;
    box-sizing:border-box;padding:24px;
    position: relative;background:#454545;
}
.layout-body .wp-menu{
    width:180px;height:100%;
}
.layout-body .wp-menu label{
    font-size:12px;color:#6e6e6e;
}
.wp-drag .drag-main{
    width:84%;height:80%;
    border:4px dashed #4d4d4d;
    text-align:center;
    position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);
    opacity:0;
}
.wp-drag .drag-main p{
    position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);
    font-size:24px;color:#999999;
}
.wp-drag .drag-main.drop-hover{
    opacity:1;
}
.drag-log p{
    font-weight:normal;font-size:14px;line-height:1.5;
    color:#999999;
}
.drag-log .succ{
    color:#45BF55;
}
.drag-log .fail{
    color:#F22233;
}
.layout-body .wp-menu .menu-options{
    padding:20px;font-size:14px;height:78%;
    box-sizing:border-box;
}
.menu-options ul li{
    margin-bottom:10px;
}
input[type=checkbox]{
    vertical-align:-2px;
}
.layout-body .wp-menu .menu-address{
    padding:18px 0;font-size:14px;
    width:146px;margin:0 auto;
    border-top:2px solid #dadada;
}
.menu-address h3{
    font-size:14px;font-weight:normal;
    margin-bottom:10px;
    color:#6e6e6e;
}
</style>

<script>
import {handleCss, handleHtml, handleImage} from '@/assets/js/hp-handlefile';
const path = global.require('path');

export default {
  data () {
    return {
      dropHover: true,
      fileInfo: [],
      mode: {
        spriteRemMode: false,
        imgQuant: false,
        plugins: []
      },
      // tips:[{txt:string, type:string('succ', 'fail', 'normal')}]
      tips: [],
      handling: false,
      progress: {
        index: 0,
        length: 0
      }
    };
  },
  watch: {
    mode: {
      handler: (val) => {
        localStorage.setItem('options', JSON.stringify(val));
      },
      deep: true
    }
  },
  methods: {
    async drop (e) {
      // 拖拽开关
      this.dropHover = false;
      // 处理提示
      this.tips = [];
      // 获取文件信息
      this.fileInfo = e.dataTransfer.files;
      console.log(this.fileInfo);
      // 正在处理文件的序号
      this.progress.index = 0;
      // 需要处理的文件数量
      this.progress.length = this.fileInfo.length - 1;
      this.handlefile();
    },
    async handlefile () {
      let pro = this.progress;
      let filePath = this.fileInfo[pro.index].path;
      // 获取文件类型
      let ext = path.parse(filePath).ext;
      this.tips.push({
        txt: `正在处理：${filePath}`,
        type: 'normal'
      });
      new Promise((resolve, reject) => {
        if (/css/.test(ext)) {
          handleCss(filePath, this.mode, resolve, reject);
        } else if (/html/.test(ext)) {
          handleHtml(filePath, resolve, reject);
        } else if (/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(ext)) {
          handleImage(filePath, this.mode.imgQuant, resolve, reject);
        }
      }).then(res => {
        this.tips.push(res);
        if (pro.index < pro.length) {
          ++this.progress.index;
          this.handlefile();
        }
      }, err => {
        this.tips.push(err);
        if (pro.index < pro.length) {
          ++this.progress.index;
          this.handlefile();
        }
      });
    }
  },
  created () {
    let mode = localStorage.getItem('options');
    if (mode) {
      this.mode = JSON.parse(mode);
    }
  }
};
</script>
