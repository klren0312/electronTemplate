'use strict'

import { app, Tray, Menu, MenuItem, protocol, screen, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

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
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 渲染层可以使用node
      webSecurity: false // 跨域
    },
    icon: path.resolve(__static, 'logo.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // 窗口最小化触发
  win.on('minimize', () => {
    console.log('最小化')
    createChildWin()
  })

  win.on('focus', () => {
    console.log('聚焦')
    closeChildWin()
  })

  // 窗口隐藏, 任务栏没有图标
  win.on('hide', () => {
    console.log('隐藏')
    createChildWin()
  })

  win.on('show', () => {
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
const path = require('path')
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
}

/**
 * 创建小窗口
 */
function createChildWin () {
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
  childWindow.close()
  childWindow = null
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
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) {
        win.restore()
      }
      win.focus()
    }
  })
}

ipcMain.on('closeChildWin', (e, arg) => {
  closeChildWin()
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
