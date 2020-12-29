/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

autoUpdater.autoDownload = false
autoUpdater.setFeedURL('http://127.0.0.1:5000')
autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString())
})

autoUpdater.on('update-available', async () => {
  const isUpdate = dialog.showMessageBoxSync({
    type: 'info',
    title: '软件更新',
    message: '发现新版本, 是否现在更新?',
    buttons: ['是', '否']
  })
  console.log('select', isUpdate)
  if (isUpdate === 0) {
    autoUpdater.downloadUpdate()
  } else {
    // updater.enabled = true
    // updater = null
  }
})

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: '暂无更新',
    message: '当前版本为最新版本'
  })
  // updater.enabled = true
  // updater = null
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: '安装更新',
    message: '更新已下载, 需要退出程序进行更新'
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
})

autoUpdater.on('download-progress', function (progressObj) {
  console.log(JSON.stringify(progressObj))
})

// export this to MenuItem click callback
function checkForUpdates (menuItem, focusedWindow, event) {
  // updater = menuItem
  // updater.enabled = false
  autoUpdater.checkForUpdates()
}
module.exports = checkForUpdates
