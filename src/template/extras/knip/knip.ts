import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: ['**/dist/*'],
  workspaces: {
    'apps/api': {
      entry: ['src/main.ts'],
      project: ['src/**/*.ts'],
      ignore: ['src/generate-schema.ts', 'src/**/*.resolver.ts'],
      ignoreDependencies: [
        '@nestjs/schematics',
        'ts-loader',
        'prisma-generator-flavoured-ids',
      ],
    },
  },
}

export default config
