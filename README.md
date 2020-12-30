## 一、项目运行
### 1. 依赖安装
```bash
yarn install
# 或者
npm install
```

### 2. 开发模式
```bash
yarn electron:serve
# 或者
npm run electron:serve
```

### 3. 生产打包
```bash
yarn electron:build
# 或者
npm run electron:build
```

### 4. eslint检测
```bash
yarn lint
# 修复
yarn lint --fix

# 或者
npm run lint
npm run lint --fix
```

## 二、相关问题
### 1. 使用本地的vue开发者工具
vue开发者工具打包后, 放到`vueDevtool`文件夹
```js
// src/background.js
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    session.defaultSession.loadExtension(path.resolve('vueDevtool'))
  }
})
```

创建窗口的时候使用下面示例方法, 才能正常显示出vue开发者工具
```js
// src/background.js
if (process.env.WEBPACK_DEV_SERVER_URL) {
  await transferWin.loadURL(
    process.env.WEBPACK_DEV_SERVER_URL + '/#/transfer'
  )
  if (!process.env.IS_TEST) transferWin.webContents.openDevTools()
} else {
  transferWin.loadURL('app://./index.html' + '/#/transfer')
}
```

### 2. 开发模式如果打开窗口时, 若开启了开发者工具, 想关闭窗口, 需要先把开发者工具关闭, 才能正常关闭窗口
在窗口关闭前, 判断开发者工具是否开启, 若开启则先关闭开发者工具, 例如
```js
if (callWin.isDevToolsOpened()) {
  callWin.closeDevTools()
}
```

### 3. 修改logo
替换`public/icon.png`, 然后执行

```bash
yarn electron:generate-icons
# 或者
npm run electron:generate-icons
```

使用
```js
const path = require('path')
path.resolve(__static, 'icon.png')
```

### 4. 透明无边框窗口, 接触到屏幕边缘会出现黑色边框问题
>https://github.com/electron/electron/issues/15947#issuecomment-571136404

需要在创建窗口时添加延时, 例如
```js
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')
setTimeout(() => createWindow(), 400)
```
win7需要选择为aero主题, 透明背景才能生效

**注意(2020.12.23):**win7虚拟机上, 开启aero主题会卡顿, 基本使用不了

### 5. 透明无边框窗口, 当关闭开发者工具时, 背景会变白色问题
> https://github.com/electron/electron/issues/10420#issuecomment-329964500

当关闭开发者工具时, 会重新创建一个新的渲染视图, 所以会使用配置的背景颜色, 如果没配置会使用默认值白色
所以需要在窗口创建时设置`backgroundColor`属性为`#00000000`


### 6. 按需引入ElementUI
在`src\assets\elementui\elementUI.js`文件中, 进行操作

### 7. 渲染进程获取主进程环境变量
> https://github.com/electron/electron/issues/5224#issuecomment-212279369

```js
const { remote } = require('electron')
const envData = remote.getGlobal('process').env
```
### 8. 打包时, 报错asar文件被占用
vscode可以再setting.json里配置忽略`dist_electron`文件夹

```json
"files.exclude": {
  "dist_electron": true,
}
```

### 9. 软件更新
使用`electron-updater`

1) 配置`vue.config.js`
设置`publish`配置, 配置了这个配置后, 打包后会生成一个`latest.yml`文件, 需要将其和安装包放在服务器同一目录下, `url`配置成服务器可以访问到这个目录的url, 也可以使用`autoUpdater.setFeedURL(url)`动态配置url

```js
pluginOptions: {
  electronBuilder: {
    builderOptions: {
      publish: [
        {
          provider: 'generic',
          url: 'http://127.0.0.1:5000'
        }
      ]
    }
  }
}
```

2) 类似示例
https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js

## 参考文档
1. [vue-cli配置](https://cli.vuejs.org/config/)
2. [electron api文档](https://www.electronjs.org/docs/api)
3. [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder)
4. [electron-build文档](https://www.electron.build/)
5. [electron-updater文档](https://www.electron.build/auto-update.html)
