<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  created () {
    const { ipcRenderer } = require('electron')
    ipcRenderer.on('token', (e, v) => {
      console.log(v)
    })
  }
}
</script>

<style lang="scss">
</style>
