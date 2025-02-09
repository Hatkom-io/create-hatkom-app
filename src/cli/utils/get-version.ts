import path from 'node:path'
import fs from 'fs-extra'
import { type PackageJson } from 'type-fest'

import { pkgRoot } from './consts.js'

const isPackageJson = (json: unknown): json is PackageJson =>
  typeof json === 'object' && json !== null && 'version' in json

export const getVersion = () => {
  const packageJsonPath = path.join(pkgRoot, 'cli/package.json')

  const packageJsonContent: unknown = fs.readJSONSync(packageJsonPath)

  if (!isPackageJson(packageJsonContent)) {
    throw new Error('Initialization failed')
  }

  return packageJsonContent.version ?? '1.0.0'
}
