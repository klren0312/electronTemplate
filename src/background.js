'use strict'

import {
  app,
  Tray,
  Menu,
  MenuItem,
  protocol,
  screen,
  BrowserWindow,
  ipcMain
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const path = require('path')
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const URLSCHEME = 'testapp' // 用户自定义 URL SCHEME
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// 设置调用协议
// remove so we can register each time as we run the app. 
app.removeAsDefaultProtocolClient(URLSCHEME);

// If we are running a non-packaged version of the app && on windows
if(process.env.NODE_ENV === 'development' && process.platform === 'win32') {
  // Set the path of electron.exe and your app.
  // These two additional parameters are only available on windows.
  app.setAsDefaultProtocolClient(URLSCHEME, process.execPath, [path.resolve(process.argv[1])]);        
} else {
  app.setAsDefaultProtocolClient(URLSCHEME);
}

// 窗口
let win = null
// 托盘
let tray = null
// 是否关闭
let isQuit = false
// 小窗口
let childWindow = null

async function createWindow () {
  Menu.setApplicationMenu(null) // 隐藏菜单
  // Create the browser window.
  const screenWidth = screen.getPrimaryDisplay().workAreaSize.width
  const screenHeight = screen.getPrimaryDisplay().workAreaSize.height
  win = new BrowserWindow({
    width: 330,
    height: 600,
    x: screenWidth - 330,
    y: screenHeight - 600,
    webPreferences: {
      nodeIntegration: true, // 渲染层可以使用node
      webSecurity: false // 跨域
    },
    icon: path.resolve(__static, 'logo.png')
  })
  win.setAlwaysOnTop(true)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
    require('./server')
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    require('./server')
    // 新实例, 判断是否是通过URL SCHEME打开, 如果是则获取数据
    const argv = process.argv
    const string = argv[argv.length - 1]
    if (string.indexOf(URLSCHEME + '://') > -1) {
      handleUrlFromWeb(string)
    }
  }

  // 窗口最小化触发
  win.on('minimize', () => {
    console.log('最小化')
    createChildWin()
  })

  win.on('focus', () => {
    flashTray(false)
    console.log('聚焦')
    closeChildWin()
  })

  // 窗口隐藏, 任务栏没有图标
  win.on('hide', () => {
    console.log('隐藏')
    createChildWin()
  })

  win.on('show', () => {
    flashTray(false)
    console.log('显示')
    closeChildWin()
  })

  // 窗口关闭触发
  // 若isQuit为false, 则不退出, 只是缩小到托盘
  win.on('close', e => {
    if (isQuit) {
      win = null
    } else {
      e.preventDefault()
      win.hide()
    }
  })
}

/**
 * 创建托盘
 */
let isLeaveTray = null
function createTray () {
  tray = new Tray(path.resolve(__static, 'logo.png'))
  const contextMenu = Menu.buildFromTemplate([
    new MenuItem({label: '显示主程序', click: () => {
      if (win.isVisible()) {
        win.focus()
      } else {
        win.show()
      }
    }}),
    new MenuItem({
      label: '前置窗口',
      type: 'checkbox',
      checked: true,
      click: (v) => {
        win.setAlwaysOnTop(v.checked)
      }
    }),
    new MenuItem({
      label: '弹小框',
      click: () => {
        createChildWin()
      }
    }),
    new MenuItem({
      label: '退出程序',
      click: () => {
        isQuit = true
        app.exit()
      }
    })
  ])
  tray.setToolTip('This is my application')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (win.isVisible()) {
      win.focus()
    } else {
      win.show()
    }
  })

  // 判断鼠标是否在托盘图标上
  tray.on('mouse-move', (e) => {
    isLeaveTray = false
    const interval = setInterval(() => {
      const trayBounds = tray.getBounds()
      const point = screen.getCursorScreenPoint()
      if(!(trayBounds.x < point.x && trayBounds.y < point.y && point.x < (trayBounds.x + trayBounds.width) && point.y < (trayBounds.y  + trayBounds.height))){
        isLeaveTray = true
        clearInterval(interval)
      }
    }, 100)
  })
}
/**
 * 闪烁
 */
let flashInterval
function flashTray (bool) {
  win.flashFrame(bool)
  if (!bool) {
    flashInterval && clearInterval(flashInterval)
    tray.setImage(path.resolve(__static, 'logo.png'))
    return
  }
  flashInterval && clearInterval(flashInterval)
  var count = 0
  flashInterval = setInterval(function() {
    if (count++ % 2 == 0) {
      tray.setImage(path.resolve(__static, 'empty.png'))
    } else {
      tray.setImage(path.resolve(__static, 'logo.png'))
    }
  }, 400)
}

/**
 * 创建小窗口
 */
function createChildWin () {
  if (childWindow) return
  const screenWidth = screen.getPrimaryDisplay().workAreaSize.width
  const screenHeight = screen.getPrimaryDisplay().workAreaSize.height
  childWindow = new BrowserWindow({
    width: 200,
    height: 200,
    x: screenWidth - 200,
    y: screenHeight - 200,
    focusable: true, // 聚焦
    frame: false, // 无外框架
    transparent: true, // 透明
    maximizable: false, // 不可缩放
    webPreferences: {
      nodeIntegration: true
    },
    skipTaskbar: true,
    icon: path.resolve(__static, 'logo.png')
  })
  const url = process.env.NODE_ENV === 'development'
    ? 'http://localhost:11111'
    : `file://${__dirname}/index.html`
  childWindow.loadURL(url + '/#/single')
  childWindow.setAlwaysOnTop(true) // 放在顶层固定
}

/**
 * 关闭小窗口
 */
function closeChildWin () {
  if (childWindow) {
    childWindow.close()
    childWindow = null
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // try {
    //   await installExtension(VUEJS_DEVTOOLS)
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow()
  createTray()
})

// 只允许单个实例
// https://www.electronjs.org/docs/api/app#apprequestsingleinstancelock
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv) => {
    if (process.platform === 'win32') {
      console.log("window 准备执行网页端调起客户端逻辑")
      if (win) {
        if (win.isMinimized()) {
          win.restore()
        }
        if (win.isVisible()) {
          win.focus()
        } else {
          win.show()
        }
      }
      handleArgvFromWeb(argv)
    }
  })
}

// window 系统中执行网页调起应用时，处理协议传入的参数
const handleArgvFromWeb = (argv) => {
  console.log(argv)
  const url = argv.find(v => v.indexOf(`${URLSCHEME}://`) !== -1)
  console.log(url)
  if (url) handleUrlFromWeb(url)
}

// 进行处理网页传来 url 参数，参数自定义，以下为示例
// 示例调起应用的 url 为 testapp://?token=205bdf49hc97ch4146h8124h8281a81fdcdb
const handleUrlFromWeb = (urlStr) => {
  console.log(urlStr)
  const urlObj = new URL(urlStr)
  const { searchParams } = urlObj
  const token = searchParams.get('token')
  win.webContents.send('token', token)
  console.log(token)
}

// 打开弹框
ipcMain.on('openChildWin', (e, arg) => {
  createChildWin()
})

// 关闭弹框
ipcMain.on('closeChildWin', (e, arg) => {
  closeChildWin()
})

// 开启闪动
ipcMain.on('flashTray', (e, arg) => {
  flashTray(arg)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
