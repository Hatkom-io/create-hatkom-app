import path from 'node:path'
import { PkgInstallerMap } from '../installers/index.js'
import { getUserPkgManager } from '../utils/get-user-package-manager.js'
import { scaffoldProject } from './scaffold-project.js'

import { installPackages } from './install-packages.js'

type CreateProjectOptions = {
  projectName: string
  packages: PkgInstallerMap
  scopedAppName?: string
  noInstall: boolean
}

export const createProject = async ({
  projectName,
  packages,
  noInstall,
}: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager()
  const projectDir = path.resolve(process.cwd(), projectName)

  // Bootstraps the base monorepo
  await scaffoldProject({
    projectName,
    projectDir,
    pkgManager,
    noInstall,
  })

  // Install the selected packages
  installPackages({
    projectName,
    projectDir,
    pkgManager,
    packages,
    noInstall,
  })

  return projectDir
}
