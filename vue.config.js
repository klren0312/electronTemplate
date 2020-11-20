module.exports = {
  // 接口配置
  devServer: {
    port: 11111
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      fileAssociations: {
        protocols: ['testapp']
      },
      builderOptions: {
        asar: false,
        win: {
          target: [
            {
              target: 'nsis',
              arch: [
                'ia32',
                'x64'
              ]
            }
          ]
        },
        nsis: {
          oneClick: false, // 一键安装
          perMachine: true, // 为所有用户安装
          allowElevation: true, // 允许权限提升, 设置 false 的话需要重新允许安装程序
          allowToChangeInstallationDirectory: true, // 允许更改安装目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单
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
