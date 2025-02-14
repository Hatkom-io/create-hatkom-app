import path from 'node:path'
import fs from 'fs-extra'
import { apiDir, eslintDir, pkgRoot } from '../utils/consts.js'
import { readPackageJson } from '../utils/read-package-json.js'
import { Installer } from './index.js'

export const nestJsInstaller: Installer = ({ projectDir }) => {
  // get src files
  const srcDir = path.join(pkgRoot, 'template/extras/nestjs')
  const apiSrc = path.join(srcDir, 'api')
  const eslintConfigSrc = path.join(srcDir, 'eslint/nest.mjs')

  // get destination files
  const eslintPkgDir = path.join(projectDir, eslintDir)
  const eslintConfigDest = path.join(eslintPkgDir, 'nest.mjs')
  const apiDest = path.join(projectDir, apiDir)

  const eslintContent = fs.readFileSync(eslintConfigSrc)

  // add eslint nest config to package json
  const eslintPkgJson = readPackageJson(eslintPkgDir)

  eslintPkgJson.files = [...(eslintPkgJson.files ?? []), 'nest.mjs']

  fs.writeJSONSync(path.join(eslintPkgDir, 'package.json'), eslintPkgJson, {
    spaces: 2,
  })

  fs.writeFileSync(eslintConfigDest, eslintContent, 'utf-8')

  fs.copySync(apiSrc, apiDest)

  fs.renameSync(
    path.join(apiDest, '_gitignore'),
    path.join(apiDest, '.gitignore'),
  )
}
