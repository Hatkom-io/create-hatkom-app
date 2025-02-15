import path from 'node:path'
import fs from 'fs-extra'
import { PackageJson } from 'type-fest'

const isPackageJson = (pkg: unknown): pkg is PackageJson =>
  typeof pkg === 'object' && !!pkg && 'name' in pkg

export const readPackageJson = (projectDir: string) => {
  const pkgJson: unknown = fs.readJSONSync(
    path.join(projectDir, 'package.json'),
  )

  if (!isPackageJson(pkgJson)) {
    throw new Error('Error reading package.json')
  }

  return pkgJson
}
