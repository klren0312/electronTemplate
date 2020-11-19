module.exports = {
  // 接口配置
  devServer: {
    port: 11111
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      win: {
        target: 'nsis'
      },
      nsis: {
        perMachine: true
      }
    }
  }
}
