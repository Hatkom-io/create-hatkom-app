import path from 'node:path'
import fs from 'fs-extra'
import sortPackageJson from 'sort-package-json'

import {
  type AvailableDependencies,
  dependencyVersionMap,
} from '../utils/dependency-versions-map.js'
import { readPackageJson } from '../utils/read-package-json.js'

export const addPackageDependency = (opts: {
  dependencies?: AvailableDependencies[]
  packages?: string[]
  devMode: boolean
  projectDir: string
}) => {
  const { dependencies, devMode, projectDir, packages } = opts

  const pkgJson = readPackageJson(projectDir)

  if (dependencies != null) {
    dependencies.forEach((pkgName) => {
      const version = dependencyVersionMap[pkgName]

      if (devMode && pkgJson.devDependencies) {
        pkgJson.devDependencies[pkgName] = version
      } else if (pkgJson.dependencies) {
        pkgJson.dependencies[pkgName] = version
      }
    })
  }

  if (packages != null) {
    const version = '*'

    packages.forEach((pkgName) => {
      if (devMode && pkgJson.devDependencies) {
        pkgJson.devDependencies[pkgName] = version
      } else if (pkgJson.dependencies) {
        pkgJson.dependencies[pkgName] = version
      }
    })
  }

  const sortedPkgJson = sortPackageJson(pkgJson)

  fs.writeJSONSync(path.join(projectDir, 'package.json'), sortedPkgJson, {
    spaces: 2,
  })
}
