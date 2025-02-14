import { InstallerOptions } from '../installers/index.js'
import { defaultAppName } from '../utils/consts.js'
import { getUserPkgManager } from '../utils/get-user-package-manager.js'
import { logger } from '../utils/logger.js'
import { isInsideGitRepo, isRootGitRepo } from './init-git.js'

// This logs the next steps that the user should take in order to advance the project
export const logNextSteps = async ({
  projectName = defaultAppName,
  packages,
  noInstall,
  projectDir,
}: Pick<
  InstallerOptions,
  'projectName' | 'packages' | 'noInstall' | 'projectDir'
>) => {
  const pkgManager = getUserPkgManager()

  logger.info('Next steps:')

  if (projectName !== '.') {
    logger.info(`  cd ${projectName}`)
  }

  if (noInstall) {
    // To reflect yarn's default behavior of installing packages when no additional args provided
    if (pkgManager === 'yarn') {
      logger.info(`\n#  ${pkgManager}`)
    } else {
      logger.info(`\n#  ${pkgManager} install`)
    }
  }

  if (packages?.nestjs.inUse) {
    logger.info('\n#  Make sure your Docker is started')
    logger.info('  Then run: ')
    logger.info(`  ${pkgManager} turbo db:start:docker`)
  }

  logger.info(`\n  ${pkgManager} turbo start:dev`)

  if (!(await isInsideGitRepo(projectDir)) && !isRootGitRepo(projectDir)) {
    logger.info('\n  git init')
  }

  logger.info(`\n  git commit -m "initial commit"`)
}
