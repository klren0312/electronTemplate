const express = require('express')
const app = express()
const log = require('electron-log')
// 设置所有路由无限制访问，不需要跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

app.get('/checkAuth', function (req, res) {
  log.info('checkAuth')
  res.send({
    code: 0,
    msg: 'ok'
  })
})

// 端口：18848
app.listen(18848, function () {
  console.log('127.0.0.1:18848')
})
