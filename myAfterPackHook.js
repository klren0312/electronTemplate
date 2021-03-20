const { Asarmor, Trashify, FileCrash } = require('asarmor')
const { join } = require('path')

exports.default = async ({ appOutDir, packager }) => {
  try {
    const asarPath = join(packager.getResourcesDir(appOutDir), 'app.asar')
    console.log(`applying asarmor protections to ${asarPath}`)
    const asarmor = new Asarmor(asarPath)
    asarmor.applyProtection(new FileCrash('background.js.LICENSE.txt'));
    asarmor.applyProtection(new Trashify(['.git', '.env']))
    asarmor.write(asarPath)
  } catch (err) {
    console.error(err)
  }
}