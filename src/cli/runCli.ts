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

  /** @internal Used in CI. */
  CI: boolean
  /** @internal Used in CI. */
  appRouter: boolean
  /** @internal Used in CI. */
  tailwind: boolean
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
    CI: false,
    tailwind: true,
    noApi: false,
    noGit: false,
    noInstall: false,
    default: false,
    appRouter: true,
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
    /** START CI-FLAGS */
    .option('--CI', "Boolean value if we're running in CI", false)
    .option(
      '--tailwind [boolean]',
      'Experimental: Boolean value if we should install Tailwind CSS. Must be used in conjunction with `--CI`.',
      (value) => !!value && value !== 'false',
    )
    .option(
      '--appRouter [boolean]',
      'Explicitly tell the CLI to use the new Next.js app router',
      (value) => !!value && value !== 'false',
    )
    /** END CI-FLAGS */
    .version(getVersion(), '-v, --version', 'Display the version number')
    .parse(process.argv)

  // Needs to be separated outside the if statement to correctly infer the type as string | undefined
  const cliProvidedName = program.args[0]

  if (cliProvidedName) {
    cliResults.appName = cliProvidedName
  }

  cliResults.flags = program.opts()

  if (cliResults.flags.CI) {
    cliResults.packages = []

    if (cliResults.flags.tailwind) {
      cliResults.packages.push('tailwind')
    }

    if (!cliResults.flags.noApi) {
      cliResults.packages.push('nestjs')
    }

    return cliResults
  }

  if (cliResults.flags.default) {
    return cliResults
  }

  // Explained below why this is in a try/catch block
  // if --CI flag is set, we are running in CI mode and should not prompt the user
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
      styling: () => {
        return p.confirm({
          message: 'Will you be using Tailwind CSS for styling?',
        })
      },
      appRouter: () => {
        return p.confirm({
          message: 'Would you like to use Next.js App Router?',
          initialValue: true,
        })
      },
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

  if (project.styling) {
    packages.push('tailwind')
  }

  return {
    appName: project.name ?? cliResults.appName,
    packages,
    flags: {
      ...cliResults.flags,
      appRouter: project.appRouter || cliResults.flags.appRouter,
      noGit: !project.git || cliResults.flags.noGit,
      noInstall: !project.install || cliResults.flags.noInstall,
    },
  }
}
