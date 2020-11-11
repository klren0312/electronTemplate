<template>
  <div class="single">
    <div class="tabbar">
      <span>标题栏</span>
      <div class="close" @click="close">x</div>
    </div>
    <button type="primary" size="mini" @click="trigger">test</button>
  </div>
</template>
<script>
export default {
  name: 'singlePage',
  data () {
    return {
    }
  },
  methods: {
    trigger () {
      alert(1)
    },
    close () {
      const { ipcRenderer } = require('electron')
      ipcRenderer.send('closeChildWin', 'test')
    }
  }
}
</script>
<style lang="scss">
.single {
  animation: fadeInUp ease-in .5s;
  .tabbar {
    position: relative;
    padding: 10px 0;
    margin-bottom: 20px;
    text-align: center;
    color: #323232;
    background: #dfdfdf;
    border-bottom: 1px solid #fff;
    -webkit-app-region: drag;
    .close {
      width: 22px;
      height: 22px;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      margin: auto;
      border: 1px solid #333;
      border-radius: 50%;
      font-size: 18px;
      color: #323232;
      cursor: pointer;
      -webkit-app-region: no-drag;
    }
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
