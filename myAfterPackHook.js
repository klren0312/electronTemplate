const { Asarmor, Trashify, FileCrash } = require('asarmor')
const { join } = require('path')
const AdmZip = require('adm-zip')
const pkg = require('./package.json')
exports.default = async ({ appOutDir, packager, outDir }) => {
  try {
    const asarPath = join(packager.getResourcesDir(appOutDir), 'app.asar')
    console.log(`applying asarmor protections to ${asarPath}`)
    const asarmor = new Asarmor(asarPath)
    asarmor.applyProtection(new FileCrash('background.js.LICENSE.txt'))
    asarmor.applyProtection(new Trashify(['.git', '.env']))
    await asarmor.write(asarPath)

    // 由于当前版本asarmor无法进行同步进行, 所以增量更新的包是没被asarmor修改的asar包
    const targetPath = join(appOutDir, './resources')
    const zip = new AdmZip()
    zip.addLocalFolder(targetPath)
    const partUpdateFile = `update-win-${pkg.version}.zip`
    zip.writeZip(join(outDir, partUpdateFile))
  } catch (err) {
    console.error(err)
  }
}
