import path from 'node:path'
import fs from 'fs-extra'
import { TsConfigJson } from 'type-fest'

const isTsConfigJson = (conf: unknown): conf is TsConfigJson =>
  typeof conf === 'object' && !!conf && 'compilerOptions' in conf

export const readTsConfig = (projectDir: string) => {
  const tsConfig: unknown = fs.readJSONSync(
    path.join(projectDir, 'tsconfig.json'),
  )

  if (!isTsConfigJson(tsConfig)) {
    throw new Error('Error reading tsconfig.json')
  }

  return tsConfig
}
