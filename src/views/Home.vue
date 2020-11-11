<template>
<div>
  <button @click="open">open</button>
  <div class="home">
    this is home
  </div>
</div>
</template>

<script>
let BrowserWindow = null
if (process.env.IS_ELECTRON) {
  BrowserWindow = require('electron').remote.BrowserWindow
}
export default {
  name: 'Home',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    open () {
      if (process.env.IS_ELECTRON) {
        const childWindow = new BrowserWindow({
          width: 200,
          height: 400,
          focusable: true, // 聚焦
          frame: false, // 无外框架
          transparent: true, // 透明
          maximizable: false, // 不可缩放
          webPreferences: {
            nodeIntegration: true
          }
        })
        const url = process.env.NODE_ENV === 'development'
          ? 'http://localhost:11111'
          : `file://${__dirname}/index.html`
        childWindow.loadURL(url + '/#/single')
        childWindow.setAlwaysOnTop(true) // 放在顶层固定
      }
    }
  }
}
</script>
<style lang="scss">
.home {
  height: 200px;
  overflow-y: auto;
}
</style>
