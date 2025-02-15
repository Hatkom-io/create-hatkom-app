import typescriptEslint from 'typescript-eslint'
import basicConfig from './base.mjs'

export default typescriptEslint.config(
  ...basicConfig,
  {
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
  {
    files: ['src/@generated/zod/**/*'],
    rules: {
      'padding-line-between-statements': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'no-useless-escape': 'off',
    },
  },
  {
    files: ['src/**/*.module.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  {
    parserOptions: {
      project: 'tsconfig.bun.json',
      sourceType: 'module',
    },
    files: ['prisma/seed.ts'],
  },
  {
    ignores: ['src/@generated/fabbrica/**/*', 'e2e.setup.js'],
  },
)
