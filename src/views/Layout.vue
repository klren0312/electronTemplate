<template>
  <div class="main-window">
    <div class="window-ctrl">
      <span class="window-ctrl-item" @click="minimizeHandle"> - </span>
      <span class="window-ctrl-item" @click="closeHandle"> x </span>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'Layout',
  data () {
    return {}
  },
  methods: {
    minimizeHandle () {
      ipcRenderer.send('minimize')
    },
    closeHandle () {
      ipcRenderer.send('close', false)
    }
  }
}
</script>
<style lang="scss">
.main-window {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 380px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0px 5px 12px 0px rgba(6, 6, 6, 0.29);
  background: #fff;
  text-align: center;
  .window-ctrl {
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #333;
    -webkit-app-region: drag;
    &-item {
      padding: 5px 10px;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-font-smoothing: antialiased;
      -webkit-app-region: no-drag;
      &:hover {
        background: #dedede;
      }
    }
  }
}
</style>
