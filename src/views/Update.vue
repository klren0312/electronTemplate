<template>
  <div class="update-page">
    更新中... {{percent.toFixed(0)}}%
    <input type="range" v-model="percent">
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'UpdatePage',
  data () {
    return {
      percent: 0
    }
  },
  mounted () {
    ipcRenderer.on('downloadProgress', (e, arg) => {
      console.log(arg)
      this.percent = arg.percent
    })
  }
}
</script>
<style lang="scss">
.update-page {
  font-size: 20px;
  color: #5B7CE7;
}
</style>
