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
          focusable: true,
          frame: false,
          transparent: true,
          maximizable: false,
          webPreferences: {
            nodeIntegration: true
          }
        })
        const url = process.env.NODE_ENV === 'development'
          ? 'http://localhost:8082'
          : `file://${__dirname}/index.html`
        childWindow.loadURL(url + '/#/single')
        childWindow.setAlwaysOnTop(true)
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
