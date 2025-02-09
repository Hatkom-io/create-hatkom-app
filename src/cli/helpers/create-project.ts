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
  appRouter: boolean
}

export const createProject = async ({
  projectName,
  packages,
  noInstall,
  appRouter,
}: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager()
  const projectDir = path.resolve(process.cwd(), projectName)

  // Bootstraps the base monorepo
  await scaffoldProject({
    projectName,
    projectDir,
    pkgManager,
    noInstall,
    appRouter,
  })

  // Install the selected packages
  installPackages({
    projectName,
    projectDir,
    pkgManager,
    packages,
    noInstall,
    appRouter,
  })

  // // Select necessary _app,index / layout,page files
  // if (appRouter) {
  //   // Replace next.config
  //   fs.copyFileSync(
  //     path.join(PKG_ROOT, 'template/extras/config/next-config-appdir.js'),
  //     path.join(projectDir, 'next.config.js'),
  //   )

  //   selectLayoutFile({ projectDir, packages })
  //   selectPageFile({ projectDir, packages })
  // } else {
  //   selectAppFile({ projectDir, packages })
  //   selectIndexFile({ projectDir, packages })
  // }

  // // If no tailwind, select use css modules
  // if (!packages.tailwind.inUse) {
  //   const indexModuleCss = path.join(
  //     PKG_ROOT,
  //     'template/extras/src/index.module.css',
  //   )
  //   const indexModuleCssDest = path.join(
  //     projectDir,
  //     'src',
  //     appRouter ? 'app' : 'pages',
  //     'index.module.css',
  //   )
  //   fs.copyFileSync(indexModuleCss, indexModuleCssDest)
  // }

  return projectDir
}
