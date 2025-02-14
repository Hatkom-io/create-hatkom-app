import { execSync } from 'node:child_process'
import https from 'node:https'
import { distTagsBodySchema } from '../validation/index.js'
import { getVersion } from './get-version.js'
import { logger } from './logger.js'

export const renderVersionWarning = (npmVersion: string) => {
  const currentVersion = getVersion()

  if (currentVersion.includes('beta')) {
    logger.warn('  You are using a beta version of create-hatkom-app.')
    logger.warn('  Please report any bugs you encounter.')
  } else if (currentVersion.includes('next')) {
    logger.warn(
      '  You are running create-hatkom-app with the @next tag which is no longer maintained.',
    )
    logger.warn('  Please run the CLI with @latest instead.')
  } else if (currentVersion !== npmVersion) {
    logger.warn('  You are using an outdated version of create-hatkom-app.')
    logger.warn(
      '  Your version:',
      `${currentVersion}.`,
      'Latest version in the npm registry:',
      npmVersion,
    )
    logger.warn('  Please run the CLI with @latest to get the latest updates.')
  }
}

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 * https://github.com/facebook/create-react-app/blob/main/packages/create-react-app/LICENSE
 */
const checkForLatestVersion = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    https
      .get(
        'https://registry.npmjs.org/-/package/create-hatkom-app/dist-tags',
        (res) => {
          if (res.statusCode === 200) {
            let body = ''
            res.on('data', (data: Buffer) => {
              body += data.toString()
            })
            res.on('end', () => {
              resolve(distTagsBodySchema.parse(JSON.parse(body)).latest)
            })
          } else {
            reject(new Error('Unable to check for latest version.'))
          }
        },
      )
      .on('error', () => {
        reject(new Error('Unable to check for latest version.'))
      })
  })
}

export const getNpmVersion = () =>
  // `fetch` to the registry is faster than `npm view` so we try that first
  checkForLatestVersion().catch(() => {
    try {
      return execSync('npm view create-hatkom-app version').toString().trim()
    } catch {
      return null
    }
  })
