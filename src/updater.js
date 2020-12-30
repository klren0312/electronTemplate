const { dialog, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')

class Updater {
  /**
   * 构造函数
   * @param {String} checkUrl 更新地址
   */
  constructor (checkUrl) {
    this.url = checkUrl
    this.updateWindow = null
    this.menu = null
  }

  /**
   * 初始化
   */
  init () {
    autoUpdater.autoDownload = false
    autoUpdater.setFeedURL(this.url)
    autoUpdater.on('error', (error) => {
      dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString())
    })

    autoUpdater.on('update-available', async () => {
      const isUpdate = dialog.showMessageBoxSync({
        type: 'info',
        title: '软件更新',
        message: '发现新版本, 是否现在更新?',
        cancelId: 233,
        buttons: ['是', '否']
      })
      if (isUpdate === 0) {
        this.menu.items[3].enabled = false
        autoUpdater.downloadUpdate()
        this.updateWindow.show()
      }
    })

    autoUpdater.on('update-not-available', () => {
      dialog.showMessageBox({
        title: '暂无更新',
        message: '当前版本为最新版本'
      })
    })

    autoUpdater.on('update-downloaded', () => {
      this.updateWindow.close()
      this.updateWindow = null
      this.menu.items[3].enabled = true
      dialog.showMessageBox({
        title: '安装更新',
        message: '更新已下载, 需要退出程序进行更新'
      }, () => {
        setTimeout(() => autoUpdater.quitAndInstall())
      })
    })

    autoUpdater.on('download-progress', (progressObj) => {
      this.updateWindow.webContents.send('downloadProgress', progressObj)
    })
  }

  /**
   * 开始检测更新
   */
  async checkForUpdates (menu) {
    this.menu = menu
    this.updateWindow = new BrowserWindow({
      width: 200,
      height: 150,
      show: false,
      focusable: true, // 聚焦
      frame: false, // 无外框架
      transparent: true, // 透明
      maximizable: false, // 不可缩放
      backgroundColor: '#00000000', // 当关闭开发者工具时, 会重新创建一个新的渲染视图, 所以会使用配置的背景颜色, 如果没配置会使用默认值白色
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true // 可以使用remote
      },
      skipTaskbar: true
    })
    this.updateWindow.setAlwaysOnTop(true) // 放在顶层固定

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await this.updateWindow.loadURL(
        process.env.WEBPACK_DEV_SERVER_URL + '/#/update'
      )
      // 开发模式开启开发者工具
      // if (!process.env.IS_TEST) this.updateWindow.webContents.openDevTools()
    } else {
      // Load the index.html when not in development
      this.updateWindow.loadURL('app://./index.html' + '/#/update')
    }
    autoUpdater.checkForUpdates()
  }
}

module.exports = Updater
