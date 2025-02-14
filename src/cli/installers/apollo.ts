import path from 'node:path'
import fs from 'fs-extra'
import { pkgRoot, webDir } from 'utils/consts.js'
import { addPackageDependency } from '../helpers/add-package-dependency.js'
import { readTsConfig } from '../utils/read-tsconfig.js'
import { Installer } from './index.js'

export const apolloInstaller: Installer = ({ projectDir }) => {
  const srcDir = path.join(pkgRoot, 'template/extras/nestjs/apollo')

  const graphqlInitFolder = path.join(srcDir, 'graphql')

  const webAppDir = path.join(projectDir, webDir)
  const webSrcDir = path.join(webAppDir, 'src')

  const srcTsConfig = readTsConfig(srcDir)
  const webTsConfig = readTsConfig(webAppDir)

  if (webTsConfig.compilerOptions?.plugins) {
    webTsConfig.compilerOptions.plugins = [
      ...webTsConfig.compilerOptions.plugins,
      ...(srcTsConfig.compilerOptions?.plugins ?? []),
    ]
  }

  fs.writeJSONSync(path.join(webAppDir, 'tsconfig.json'), webTsConfig, {
    spaces: 2,
  })

  addPackageDependency({
    dependencies: ['@apollo/client', 'gql.tada'],
    projectDir: webAppDir,
    devMode: false,
  })

  fs.copySync(webSrcDir, graphqlInitFolder)
}
