<template>
  <div class="single">
    <div class="tabbar">标题栏</div>
    <button type="primary" size="mini" @click="trigger">test</button>
  </div>
</template>
<script>
export default {
  name: 'singlePage',
  data () {
    return {}
  },
  methods: {
    trigger () {
      alert(1)
    }
  }
}
</script>
<style lang="scss">
.single {
  .tabbar {
    padding: 10px 0;
    margin-bottom: 20px;
    text-align: center;
    color: #323232;
    background: #dfdfdf;
    border-bottom: 1px solid #fff;
    -webkit-app-region: drag;
  }
}
</style>
