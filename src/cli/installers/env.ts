import path from 'node:path'
import fs from 'fs-extra'
import { apiDir, webDir } from 'utils/consts.js'
import { type Installer } from './index.js'

type GetEnvContent = {
  web?: boolean
  api?: boolean
}

export const envVariablesInstaller: Installer = ({
  projectDir,
  noApi = false,
}) => {
  const withApi = !noApi

  const webEnvContent = getEnvContent({ web: withApi })
  const apiEnvContent = getEnvContent({ api: withApi })

  const webDest = path.join(projectDir, webDir)
  const apiDest = path.join(projectDir, apiDir)

  const webEnvDest = path.join(webDest, '.env')
  const apiEnvDest = path.join(apiDest, '.env')

  const webEnvExampleDest = path.join(webDest, '.env.example')
  const apiEnvExampleDest = path.join(apiDest, '.env.example')

  const webExampleEnvContent = exampleEnvContent + webEnvContent
  const apiExampleEnvContent = exampleEnvContent + apiEnvContent

  if (withApi) {
    fs.writeFileSync(apiEnvDest, apiEnvContent, 'utf-8')
    fs.writeFileSync(apiEnvExampleDest, apiExampleEnvContent, 'utf-8')
  }

  fs.writeFileSync(webEnvDest, webEnvContent, 'utf-8')
  fs.writeFileSync(webEnvExampleDest, webExampleEnvContent, 'utf-8')
}

const getEnvContent = ({ web = false, api = false }: GetEnvContent) => {
  let content = ''

  if (api) {
    content += `
PORT=8080
APP_ENV=development
DATABASE_URL="postgresql://postgres:sfs@localhost:5432/postgres?schema=public"
WEB_URL=localhost:3000
  `.trim()
  }

  if (web) {
    content += 'NEXT_PUBLIC_API_URL=http://localhost:8080'
  }

  return content
}

const exampleEnvContent = `
# Since the ".env" file is gitignored, you can use the ".env.example" file to
# build a new ".env" file when you clone the repo. Keep this file up-to-date
# when you add new variables to \`.env\`.

# This file will be committed to version control, so make sure not to have any
# secrets in it. If you are cloning this repo, create a copy of this file named
# ".env" and populate it with your secrets.
`
  .trim()
  .concat('\n\n')
