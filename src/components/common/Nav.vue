<template>
    <div>
        <div class="logo">
            <i class="icon icon-logo"></i>
        </div>
        <div class="nav">
            <ul>
                <li><router-link to="/">工具</router-link></li>
                <li><router-link to="/moduleManageTool">模板</router-link></li>
            </ul>
        </div>
        <div class="menu">

        </div>
    </div>
</template>

<style scoped>
.logo{
    height:50px;
}
.icon-logo{
    display: block;
    width:40px;height:9px;
    background: url(/src/assets/img/logo.png);
    margin:20px auto;
}
.nav{
    margin-top:20px;
    text-align:center;
}
.nav ul{
    width:100%;
    margin-top:60px;
}
.nav ul li{
    width:100%;height:66px;
    line-height:66px;
}
.nav ul li a{
    font-size:12px;color:#535353;
    text-decoration:none;
}

</style>

<script>

</script>