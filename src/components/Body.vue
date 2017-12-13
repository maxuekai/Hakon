<template>
    <div>
        <div class="layout-body">
            <div class="wp-drag">
                <div class="drag-main drop-hover">将文件拖拽到此区域</div>
                <div class="drag-log">
                    <p class="normal"></p>
                    <p class="succ"></p>
                    <p class="fail"></p>
                </div>
            </div>
            <div class="wp-menu">
                <div class="menu-options">
                    <ul>
                        <li><input type="checkbox" class="option" value="pc">雪碧图pc模式</li>
                        <li><input type="checkbox" class="option" value="rem">雪碧图rem模式</li>
                        <li><input type="checkbox" class="option" value="picnano">压缩图片</li>
                        <li><input type="checkbox" class="option" value="cssnext">使用最新css</li>
                        <li><input type="checkbox" class="option" value="autoprefixer">自动加前缀功能</li>
                        <li><input type="checkbox" class="option" value="cssnano">压缩css</li>
                        <li><input type="checkbox" class="option" value="@import">处理@import文件</li>
                    </ul>
                </div>
                <div class="menu-address">
                    <h3>保存到</h3>
                    <div class="local">
                        <input type="checkbox" value="local" checked>本地
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-body{
    display:flex;
}
.layout-body .wp-drag{
    flex:2;height:100vh;
    border-right:1px solid #CDCDCD;
    box-sizing:border-box;padding:24px;
    position: relative;
}
.layout-body .wp-menu{
    flex:1;height:100vh;
}
.wp-drag .drag-main{
    width:50%;height:50vh;
    color:#CDCDCD;border:3px dashed;font-size:24px;
    text-align:center;line-height:50vh;
    position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);
    opacity:0;
}
.wp-drag .drag-main.drop-hover{
    opacity:1;
}
.drag-log p{
    font-weight:normal;font-size:14px;line-height:1.5;
}
.drag-log .succ{
    color:#45BF55;
}
.drag-log .fail{
    color:#F22233;
}
.layout-body .wp-menu .menu-options{
    padding:20px;font-size:14px;height:60vh;
    border-bottom:1px solid #CDCDCD;box-sizing:border-box;
}
.menu-options ul li{
    margin-bottom:10px;
}
input[type=checkbox]{
    vertical-align:-2px;
}
.layout-body .wp-menu .menu-address{
    padding:10px 20px;font-size:14px;
    height:40vh;box-sizing: border-box;
}
.menu-address h3{
    font-size:14px;font-weight:normal;
    margin-bottom:10px;margin-left:-10px;
}
</style>