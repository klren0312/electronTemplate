const path = require('path')
const pkg = require('./package.json')
const fs = require('fs')

function appendIntro (context, latest) {
  const partUpdateFile = `update-win-${pkg.version}.zip`

  const partUpdateUrl = context.configuration.publish.url + partUpdateFile

  const latestFilePath = path.join(context.outDir, latest)
  fs.appendFile(latestFilePath, `\npartPackage: ${partUpdateUrl}\nreleaseNotes: \n  - 升级日志`, (err) => {
    if (err) {
      console.log('修改latest 失败')
    }
  })
}
exports.default = async function (context) {
  appendIntro(context, 'latest.yml')
}
