#!/usr/bin/env node
import gradient from 'gradient-string'
import { createProject } from './helpers/create-project.js'
import { initializeGit } from './helpers/init-git.js'
import { installDependencies } from './helpers/install-dependencies.js'
import { logNextSteps } from './helpers/log-next-steps.js'
import { buildPkgInstallerMap } from './installers/index.js'
import { runCli } from './runCli.js'
import { titleText } from './utils/consts.js'
import { logger } from './utils/logger.js'
import { parseNameAndPath } from './utils/parse-name-and-path.js'
import {
  getNpmVersion,
  renderVersionWarning,
} from './utils/render-version-warning.js'
import { writeProjectName } from './utils/write-project-name.js'

const poimandresTheme = {
  blue: '#add7ff',
  cyan: '#89ddff',
  green: '#5de4c7',
}

const main = async () => {
  const npmVersion = await getNpmVersion()

  console.log(gradient(Object.values(poimandresTheme)).multiline(titleText))

  if (npmVersion) {
    renderVersionWarning(npmVersion)
  }

  const {
    appName,
    packages,
    flags: { noInstall, noGit },
  } = await runCli()

  const usePackages = buildPkgInstallerMap(packages)

  // // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
  const [scopedAppName, appDir] = parseNameAndPath(appName)

  const projectDir = await createProject({
    projectName: appDir,
    scopedAppName,
    packages: usePackages,
    noInstall,
  })

  // Write name to package.json
  await writeProjectName({
    projectDir,
    scopedAppName,
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
