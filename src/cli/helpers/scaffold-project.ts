import path from 'node:path'
import * as p from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs-extra'
import ora from 'ora'
import { InstallerOptions } from '../installers/index.js'
import { pkgRoot } from '../utils/consts.js'
import { logger } from '../utils/logger.js'

// This bootstraps the base Next.js application
export const scaffoldProject = async ({
  projectName,
  projectDir,
  pkgManager,
  noInstall,
}: InstallerOptions) => {
  const srcDir = path.join(pkgRoot, 'template/base')
  const webDir = path.join(projectDir, 'apps/web')

  if (!noInstall) {
    logger.info(`\nUsing: ${chalk.cyan.bold(pkgManager)}\n`)
  } else {
    logger.info('')
  }

  const spinner = ora(`Scaffolding in: ${projectDir}...\n`).start()

  if (fs.existsSync(projectDir)) {
    if (fs.readdirSync(projectDir).length === 0) {
      if (projectName !== '.')
        spinner.info(
          `${chalk.cyan.bold(projectName)} exists but is empty, continuing...\n`,
        )
    } else {
      spinner.stopAndPersist()
      const overwriteDir = await p.select({
        message: `${chalk.redBright.bold('Warning:')} ${chalk.cyan.bold(
          projectName,
        )} already exists and isn't empty. How would you like to proceed?`,
        options: [
          {
            label: 'Abort installation (recommended)',
            value: 'abort',
          },
          {
            label: 'Clear the directory and continue installation',
            value: 'clear',
          },
          {
            label: 'Continue installation and overwrite conflicting files',
            value: 'overwrite',
          },
        ],
        initialValue: 'abort',
      })

      if (p.isCancel(overwriteDir) || overwriteDir === 'abort') {
        spinner.fail('Aborting installation...')
        process.exit(1)
      }

      const confirmOverwriteDir = await p.confirm({
        message: `Are you sure you want to ${
          overwriteDir === 'clear'
            ? 'clear the directory'
            : 'overwrite conflicting files'
        }?`,
        initialValue: false,
      })

      if (p.isCancel(confirmOverwriteDir) || !confirmOverwriteDir) {
        spinner.fail('Aborting installation...')
        process.exit(1)
      }

      if (overwriteDir === 'clear') {
        spinner.info(
          `Emptying ${chalk.cyan.bold(projectName)} and creating hatkom app..\n`,
        )
        fs.emptyDirSync(projectDir)
      }
    }
  }

  spinner.start()

  fs.copySync(srcDir, projectDir)
  fs.renameSync(
    path.join(projectDir, '_gitignore'),
    path.join(projectDir, '.gitignore'),
  )
  fs.renameSync(
    path.join(webDir, '_gitignore'),
    path.join(webDir, '.gitignore'),
  )

  const scaffoldedName =
    projectName === '.' ? 'App' : chalk.cyan.bold(projectName)

  spinner.succeed(
    `${scaffoldedName} ${chalk.green('scaffolded successfully!')}\n`,
  )
}
