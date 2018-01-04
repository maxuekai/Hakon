<template>
  <div>
    <div class="layout-cont">
      <div class="layout-code">
        <div class="code-item" v-if="html">
          <div class="item-hd">
            <h3>HTML</h3>
            <button class="btn btn-copy" v-clipboard:copy="html" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</button>
          </div>
          <div class="item-bd">
            <pre v-highlightjs="html"><code class="html"></code></pre>
          </div>
        </div>
        <div class="code-item" v-if="css">
          <div class="item-hd">
            <h3>CSS</h3>
            <button class="btn btn-copy" v-clipboard:copy="css" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</button>
          </div>
          <div class="item-bd">
            <pre v-highlightjs="css"><code class="css"></code></pre>
          </div>
        </div>
        <div class="code-item" v-if="js">
          <div class="item-hd">
            <h3>Javascript</h3>
            <button class="btn btn-copy" v-clipboard:copy="js" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</button>
          </div>
          <div class="item-bd">
            <pre v-highlightjs="js"><code class="javascript"></code></pre>
          </div>
        </div>
      </div>
      <div class="layout-preview" v-bind:class="{fullscreen: fullscreen}">
        <a href="javascript:;" class="icon icon-slideUpDown" @click="fullscreen = !fullscreen"></a>
        <iframe id="frame" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-cont{
  display: flex;flex-direction:column;
  width:100%;height:calc(100vh - 50px);
  box-sizing:border-box;
  padding:10px 12px;
  background: #454545;
}
.layout-cont .layout-code{
  flex:2;margin-bottom:10px;
  display:flex;
}
.layout-cont .layout-preview{
  flex:1.5;background: #ffffff;
  transition:.5s;height:0;
}
.layout-cont .layout-preview.fullscreen{
  height:calc(100vh - 144px);
  flex:auto;
}
.layout-cont .layout-code .code-item{
  flex: 1;
  margin-right:4px;
  display:flex;flex-direction:column;
  overflow: hidden;
}
.layout-cont .layout-code .code-item:last-child{
  margin-right:0;
}
.code-item .item-hd{
  height:42px;line-height:42px;
  background:#000;
  border-bottom:1px solid #454545;
  position: relative;
}
.code-item .item-hd h3{
  font-size:12px;color:#eeeeee;font-weight:bold;
  float: left;margin-left:16px;
}
.code-item .item-hd .btn-copy{
  position: absolute;top:0;bottom:0;margin:auto 0;right:8px;
  width:55px;height:24px;line-height:24px;
  border-radius:24px;background: #fff;
  color:#808080;font-size:12px;text-align:center;
  text-decoration:none;outline:none;border:none;
  cursor: pointer;
}
.code-item .item-bd{
  flex: 1;
  overflow: auto;
}
.code-item pre,.code-item pre code{
  height:100%;box-sizing:border-box;
  line-height:1.5;
}
.layout-cont .layout-code .code-item pre code::selection,.layout-cont .layout-code .code-item pre code span::selection{
  background: rgb(211, 210, 210);
}
.layout-cont .layout-code .code-item pre code::-webkit-selection,.layout-cont .layout-code .code-item pre code span::-webkit-selection{
  background: rgb(211, 210, 210);
}
.layout-preview{
  position: relative;
}
.layout-preview .icon-slideUpDown{
  position: absolute;top:10px;right:10px;
  width:30px;height:30px;
  background:url(/src/assets/img/icon-up.png);
}
.layout-preview.fullscreen .icon-slideUpDown{
  background:url(/src/assets/img/icon-down.png);
}
.layout-preview iframe{
  width:100%;height:100%;
}
</style>

<script>
  import 'highlight.js/styles/hybrid.css';
  import { getModule } from '@/api';

  export default {
    data () {
      return {
        html: ``,
        css: '',
        js: '',
        fullscreen: false
      };
    },
    watch: {
      '$route': 'fetchData',
      'html': 'show',
      'css': 'show',
      'js': 'show'
    },
    methods: {
      show () {
        let iframe = document.getElementById('frame');
        let idoc = iframe.contentWindow.document;
        idoc.open();
        idoc.write(`<style>${this.css}</style>${this.html}<script>${this.js}<\/script>`);
        idoc.close();
      },
      onCopy () {
        alert('复制成功');
      },
      onError () {
        alert('复制失败');
      },
      async fetchData () {
        try {
          const res = await getModule(this.$route.params.moduleId);
          if (res.data.code === 200) {
            const data = res.data.data;
            this.html = data.html;
            this.css = data.css;
            this.js = data.js;
          }
        } catch (err) {
          console.error(err);
        }
      }
    },
    mounted () {
      this.show();
    }
  };
</script>