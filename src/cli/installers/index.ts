import { PackageManager } from 'utils/get-user-package-manager.js'
import { envVariablesInstaller } from './env.js'
import { nestJsInstaller } from './nestjs.js'

export const availablePackages = [
  'nestjs',
  // 'tailwind',
  'envVariables',
] as const

export type AvailablePackages = (typeof availablePackages)[number]

export type InstallerOptions = {
  projectDir: string
  pkgManager: PackageManager
  noInstall: boolean
  noApi?: boolean
  packages?: PkgInstallerMap
  appRouter?: boolean
  projectName: string
  scopedAppName?: string
}

export type Installer = (opts: InstallerOptions) => void

type PkgInstaller = {
  inUse: boolean
  installer: Installer
}

export type PkgInstallerMap = Record<AvailablePackages, PkgInstaller>

export const buildPkgInstallerMap = (
  packages: AvailablePackages[],
): PkgInstallerMap => ({
  nestjs: {
    inUse: packages.includes('nestjs'),
    installer: nestJsInstaller,
  },
  // tailwind: {
  //   inUse: packages.includes('tailwind'),
  //   installer: tailwindInstaller,
  // },
  envVariables: {
    inUse: true,
    installer: envVariablesInstaller,
  },
  // eslint: {
  //   inUse: true,
  //   installer: dynamicEslintInstaller,
  // },
})
