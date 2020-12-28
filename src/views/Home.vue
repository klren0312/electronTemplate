<template>
<div>
  <template v-if="isElectron">
    <button @click="openDialog">打开提示框</button>
    <button @click="openWindow">打开新窗口</button>
  </template>
  <div class="home">
    this is home
  </div>
  <div>
    <button @click="flash">闪烁</button>
  </div>
</div>
</template>

<script>
import { ipcRenderer } from 'electron'
let Dialog = null
if (process.env.IS_ELECTRON) {
  Dialog = require('electron').remote.dialog
}
export default {
  name: 'Home',
  data () {
    return {
      isElectron: process.env.IS_ELECTRON
    }
  },
  mounted () {
  },
  methods: {
    openDialog () {
      Dialog.showMessageBox({
        type: 'info',
        title: '测试弹框',
        message: 'testtesttesttesttest'
      })
    },
    openWindow () {
      ipcRenderer.send('openChildWin')
    },
    flash () {
      ipcRenderer.send('flashTray', true)
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
