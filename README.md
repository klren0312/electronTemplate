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

需要在创建窗口时添加延时, 例如,
```js
setTimeout(() => createWindow(), 400)
```

### 5. 按需引入ElementUI
在`src\assets\elementui\elementUI.js`文件中, 进行操作