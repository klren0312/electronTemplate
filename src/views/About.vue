<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="openUrl">打开浏览器</button>
  </div>
</template>
<script>
const { shell } = require('electron')
export default {
  name: 'About',
  methods: {
    openUrl () {
      shell.openExternal('https://www.bing.com')
    }
  }
}
</script>
