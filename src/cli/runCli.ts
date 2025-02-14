import * as p from '@clack/prompts'
import { Command } from 'commander'
import { AvailablePackages } from './installers/index.js'
import { createHatkomApp, defaultAppName } from './utils/consts.js'
import { getUserPkgManager } from './utils/get-user-package-manager.js'
import { getVersion } from './utils/get-version.js'
import { validateAppName } from './validation/index.js'

type CliFlags = {
  noGit: boolean
  noInstall: boolean
  noApi: boolean
  default: boolean
}

type CliResults = {
  appName: string
  packages: AvailablePackages[]
  flags: CliFlags
}

const defaultOptions: CliResults = {
  appName: defaultAppName,
  packages: ['nestjs'],
  flags: {
    noApi: false,
    noGit: false,
    noInstall: false,
    default: false,
  },
}

export const runCli = async (): Promise<CliResults> => {
  const cliResults = defaultOptions

  const program = new Command()
    .name(createHatkomApp)
    .description('A CLI for creating web applications with the Hatkom stack')
    .argument(
      '[dir]',
      'The name of the application, as well as the name of the directory to create',
    )
    .option(
      '--noApi',
      'Explicity tell the CLI to not initialize nestjs app in the project',
      false,
    )
    .option(
      '--noGit',
      'Explicitly tell the CLI to not initialize a new git repo in the project',
      false,
    )
    .option(
      '--noInstall',
      "Explicitly tell the CLI to not run the package manager's install command",
      false,
    )
    .option(
      '-y, --default',
      'Bypass the CLI and use all default options to bootstrap a new t3-app',
      false,
    )

    .version(getVersion(), '-v, --version', 'Display the version number')
    .parse(process.argv)

  // Needs to be separated outside the if statement to correctly infer the type as string | undefined
  const cliProvidedName = program.args[0]

  if (cliProvidedName) {
    cliResults.appName = cliProvidedName
  }

  cliResults.flags = program.opts()

  if (cliResults.flags.default) {
    return cliResults
  }

  const pkgManager = getUserPkgManager()

  const project = await p.group(
    {
      ...(!cliProvidedName && {
        name: () =>
          p.text({
            message: 'What will your project be called?',
            defaultValue: cliProvidedName,
            validate: validateAppName,
          }),
      }),
      api: () => {
        return p.confirm({
          message: 'Should we initialize NestJS app?',
          initialValue: true,
        })
      },
      ...(!cliResults.flags.noGit && {
        git: () => {
          return p.confirm({
            message:
              'Should we initialize a Git repository and stage the changes?',
            initialValue: !defaultOptions.flags.noGit,
          })
        },
      }),
      ...(!cliResults.flags.noInstall && {
        install: () => {
          return p.confirm({
            message: `Should we run '${pkgManager}${pkgManager === 'yarn' ? `'?` : ` install' for you?`}`,
            initialValue: !defaultOptions.flags.noInstall,
          })
        },
      }),
    },
    {
      onCancel() {
        process.exit(1)
      },
    },
  )

  const packages: AvailablePackages[] = []

  if (project.api) {
    packages.push('nestjs')
  }

  return {
    appName: project.name ?? cliResults.appName,
    packages,
    flags: {
      ...cliResults.flags,
      noGit: !project.git || cliResults.flags.noGit,
      noInstall: !project.install || cliResults.flags.noInstall,
    },
  }
}
