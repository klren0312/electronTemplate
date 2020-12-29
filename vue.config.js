module.exports = {
  // 接口配置
  devServer: {
    port: 11111
  },
  pluginOptions: {
    electronBuilder: {
      productName: '软件名称',
      nodeIntegration: true,
      fileAssociations: {
        protocols: ['testapp']
      },
      builderOptions: {
        asar: false,
        win: {
          target: [
            {
              target: 'nsis', // 打包安装包
              arch: ['ia32', 'x64'] // windows 32位 和 64位
            },
            {
              target: 'portable', // 打包单文件
              arch: ['ia32', 'x64'] // windows 32位 和 64位
            }
          ]
        },
        publish: [
          {
            provider: 'generic',
            url: 'http://127.0.0.1:5000'
          }
        ],
        nsis: {
          oneClick: false, // 一键安装
          perMachine: true, // 为所有用户安装
          allowElevation: true, // 允许权限提升, 设置 false 的话需要重新允许安装程序
          allowToChangeInstallationDirectory: true, // 允许更改安装目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单
          deleteAppDataOnUninstall: true, // 卸载时清除应用数据
          include: './public/nsis/installer.nsh', // 包含的脚本
          guid: '53fe4cba-120d-4851-3cdc-dccb3a469019' // 软件guid
        },
        files: [
          '**/*',
          '!src/'
        ]
      }
    }
  }
}
