import { PackageManager } from '../utils/get-user-package-manager.js'
import { apolloInstaller } from './apollo.js'
import { envVariablesInstaller } from './env.js'
import { nestJsInstaller } from './nestjs.js'

export const availablePackages = ['nestjs', 'apollo', 'envVariables'] as const

export type AvailablePackages = (typeof availablePackages)[number]

export type InstallerOptions = {
  projectDir: string
  pkgManager: PackageManager
  noInstall: boolean
  noApi?: boolean
  packages?: PkgInstallerMap
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
  envVariables: {
    inUse: true,
    installer: envVariablesInstaller,
  },
  apollo: {
    inUse: packages.includes('nestjs'),
    installer: apolloInstaller,
  },
})
