import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { addPackageDependency } from '../helpers/add-package-dependency.js'
import { apiDir, eslintDir, webDir } from './consts.js'
import { getUserPkgManager } from './get-user-package-manager.js'
import { readPackageJson } from './read-package-json.js'

type WritePackageNameProps = {
  projectDir: string
  scopedAppName: string
  noApi?: boolean
}

export const writeProjectName = async ({
  projectDir,
  scopedAppName,
  noApi = false,
}: WritePackageNameProps) => {
  const pkgManager = getUserPkgManager()

  const eslintPkgDir = path.join(projectDir, eslintDir)
  const apiAppDir = path.join(projectDir, apiDir)
  const webAppDir = path.join(projectDir, webDir)

  const rootPkgJson = readPackageJson(projectDir)
  const eslintPkgJson = readPackageJson(eslintPkgDir)

  const eslintPkgName = `@${scopedAppName}/eslint-config`

  eslintPkgJson.name = eslintPkgName
  rootPkgJson.name = scopedAppName

  // add package manager version to package json
  const { stdout } = await execa(pkgManager, ['-v'], {
    cwd: projectDir,
  })
  rootPkgJson.packageManager = `${pkgManager}@${stdout.trim()}`

  fs.writeJSONSync(path.join(projectDir, 'package.json'), rootPkgJson, {
    spaces: 2,
  })
  fs.writeJSONSync(path.join(eslintPkgDir, 'package.json'), eslintPkgJson, {
    spaces: 2,
  })

  addPackageDependency({
    packages: [eslintPkgName],
    devMode: true,
    projectDir: webAppDir,
  })

  resolveEslintConfigName({
    projectDir: webAppDir,
    eslintPkgName,
    configFileName: 'next.mjs',
  })

  if (!noApi) {
    addPackageDependency({
      packages: [eslintPkgName],
      devMode: true,
      projectDir: apiAppDir,
    })

    resolveEslintConfigName({
      projectDir: apiAppDir,
      eslintPkgName,
      configFileName: 'nest.mjs',
    })
  }
}

type ResolveEslintConfigNameArgs = {
  projectDir: string
  eslintPkgName: string
  configFileName: string
}

const resolveEslintConfigName = ({
  projectDir,
  eslintPkgName,
  configFileName,
}: ResolveEslintConfigNameArgs) => {
  const filePath = path.resolve(projectDir, 'eslint.config.mjs')

  const eslintConfig = fs.readFileSync(filePath, 'utf-8')

  const resolvedContent = eslintConfig.replace(
    `import defaultConfig from '@monorepo/eslint-config/${configFileName}'`,
    `import defaultConfig from '${eslintPkgName}/${configFileName}'`,
  )

  fs.writeFileSync(filePath, resolvedContent, 'utf-8')
}
