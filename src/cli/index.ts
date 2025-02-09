#!/usr/bin/env node

import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import gradient from 'gradient-string'
import { PackageJson } from 'type-fest'
import { getVersion } from 'utils/get-version.js'
import { createProject } from './helpers/create-project.js'
import { initializeGit } from './helpers/init-git.js'
import { installDependencies } from './helpers/install-dependencies.js'
import { logNextSteps } from './helpers/log-next-steps.js'
import { buildPkgInstallerMap } from './installers/index.js'
import { runCli } from './runCli.js'
import { titleText } from './utils/consts.js'
import { getUserPkgManager } from './utils/get-user-package-manager.js'
import { logger } from './utils/logger.js'
import { parseNameAndPath } from './utils/parse-name-and-path.js'
import {
  getNpmVersion,
  renderVersionWarning,
} from './utils/render-version-warning.js'

const poimandresTheme = {
  blue: '#add7ff',
  cyan: '#89ddff',
  green: '#5de4c7',
}

type CHAPackageJson = PackageJson & {
  chaMetadata?: {
    initVersion: string
  }
}

const main = async () => {
  const npmVersion = await getNpmVersion()
  const pkgManager = getUserPkgManager()

  console.log(gradient(Object.values(poimandresTheme)).multiline(titleText))

  if (npmVersion) {
    renderVersionWarning(npmVersion)
  }

  const {
    appName,
    packages,
    flags: { noInstall, noGit, appRouter },
  } = await runCli()

  const usePackages = buildPkgInstallerMap(packages)

  // // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
  const [scopedAppName, appDir] = parseNameAndPath(appName)

  const projectDir = await createProject({
    projectName: appDir,
    scopedAppName,
    packages: usePackages,
    noInstall,
    appRouter,
  })

  // Write name to package.json
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const pkgJson = fs.readJSONSync(
    path.join(projectDir, 'package.json'),
  ) as CHAPackageJson

  pkgJson.name = scopedAppName
  pkgJson.chaMetadata = { initVersion: getVersion() }

  // ? Bun doesn't support this field (yet)
  const { stdout } = await execa(pkgManager, ['-v'], {
    cwd: projectDir,
  })

  pkgJson.packageManager = `${pkgManager}@${stdout.trim()}`

  fs.writeJSONSync(path.join(projectDir, 'package.json'), pkgJson, {
    spaces: 2,
  })

  if (!noInstall) {
    await installDependencies({ projectDir })
  }

  if (!noGit) {
    await initializeGit(projectDir)
  }

  await logNextSteps({
    projectName: appDir,
    packages: usePackages,
    appRouter,
    noInstall,
    projectDir,
  })

  process.exit(0)
}

main().catch((err: unknown) => {
  logger.error('Aborting installation...')

  if (err instanceof Error) {
    logger.error(err)
  } else {
    logger.error(
      'An unknown error has occurred. Please open an issue on github with the below:',
    )
    console.log(err)
  }
  process.exit(1)
})
