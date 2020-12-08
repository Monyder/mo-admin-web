<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  /*mounted() {
    let isChrome = navigator.userAgent.indexOf('Chrome') > -1
    if (!isChrome) {
      this.$message({
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: '<strong>建议使用Chrome浏览器访问本系统</strong>，<a href="/downLoadChrome" target="_blank">点击下载</a>',
        type: 'warning'
      })
    }
  }*/

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
  margin-top: -8px;
  margin-left: -8px;
}
#nprogress .bar {
  background: #36bc98 !important;
}
</style>
