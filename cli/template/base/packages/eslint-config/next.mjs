import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import promise from 'eslint-plugin-promise'
import reactPlugin from 'eslint-plugin-react'
import typescriptEslint from 'typescript-eslint'
import basicConfig from './base.mjs'

export default typescriptEslint.config(
  ...basicConfig,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    plugins: {
      promise,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      react: reactPlugin,
      //
      // FIXME: Needs to be upgraded
      // '@graphql-eslint/eslint-plugin': graphqlEslint,
      //
      '@typescript-eslint/eslint-plugin': typescriptEslint,
    },
    rules: {
      ...basicConfig.rules,
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        {
          ignorePrimitives: {
            boolean: true,
          },
        },
      ],
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      'no-return-await': 'error',
      'require-await': 'error',
      'promise/prefer-await-to-then': ['error'],
      'import/no-default-export': ['warn'],
      'import/no-cycle': ['warn'],
      'import/prefer-default-export': 'off',
      'jsx-quotes': ['error', 'prefer-single'],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'react/jsx-props-no-spreading': 'off',
      'import/extensions': 'off',
      'react/no-array-index-key': 'off',
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'always',
          children: 'always',
        },
      ],

      'max-len': 'off',
      'react/jsx-key': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      indent: 'off',
      // 'react/function-component-definition': [
      //   2,
      //   {
      //     namedComponents: 'arrow-function',
      //   },
      // ],
      'react/jsx-filename-extension': 'off',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      'react/require-default-props': 'off',
      'no-underscore-dangle': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'no-nested-ternary': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'eol-last': 'error',
      'no-warning-comments': 'warn',
      'react/jsx-no-bind': [
        'error',
        {
          allowArrowFunctions: false,
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: false,
          // Take both root and package.json into account
          packageDir: ['./../../', './'],
        },
      ],

      //
      // Didn't work with Monorepo
      'import/named': 'off',

      //
      // Fix for
      // TypeError: Error while loading rule 'react/function-component-definition': `[[GeneratorState]]` is not present on `O`
      'react/function-component-definition': 'off',
      'react/no-unstable-nested-components': 'off',
      'react/display-name': 'off',
      'react/no-direct-mutation-state': 'off',
      'react/require-render-return': 'off',
      //
    },
    settings: { react: { version: 'detect' } },
  },
  {
    files: ['src/app/**/*'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['src/@generated/zod/**/*'],
    rules: {
      'import/no-cycle': 'off',
      'padding-line-between-statements': 'off',
      quotes: 'off',
      'no-useless-escape': 'off',
      '@typescript-eslint/quotes': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  {
    files: ['src/graphql/index.ts'],
    rules: {
      'padding-line-between-statements': 'off',
    },
  },
  {
    ignores: ['next.config.js', '.next', '.turbo'],
  },
)
