import path from 'node:path'
import fs from 'fs-extra'
import { apiDir, eslintDir, pkgRoot } from '../utils/consts.js'
import { Installer } from './index.js'

export const nestJsInstaller: Installer = ({ projectDir }) => {
  const srcDir = path.join(pkgRoot, 'template/extras/nestjs')
  const apiSrc = path.join(srcDir, 'api')
  const eslintConfigSrc = path.join(srcDir, 'eslint/nest.mjs')

  const eslintConfigDest = path.join(projectDir, eslintDir, 'nest.mjs')
  const apiDest = path.join(projectDir, apiDir)

  try {
    const eslintContent = fs.readFileSync(eslintConfigSrc)
    fs.writeFileSync(eslintConfigDest, eslintContent, 'utf-8')
  } catch (e) {
    console.error(e)
  }
  fs.copySync(apiSrc, apiDest)

  fs.renameSync(
    path.join(apiDest, '_gitignore'),
    path.join(apiDest, '.gitignore'),
  )
}
