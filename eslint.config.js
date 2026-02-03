import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import eslint from '@eslint/js'
import pluginMarkdown from '@eslint/markdown'
import { defineConfig, globalIgnores } from 'eslint/config'
import configPrettier from 'eslint-config-prettier/flat'
import pluginESx from 'eslint-plugin-es-x'
import pluginImport from 'eslint-plugin-import'
import pluginJsdoc from 'eslint-plugin-jsdoc'
import pluginNode from 'eslint-plugin-n'
import pluginPromise from 'eslint-plugin-promise'
import globals from 'globals'
import pluginTypeScript from 'typescript-eslint'

const rootPath = resolve(fileURLToPath(new URL('.', import.meta.url)))
const gitignorePath = join(rootPath, '.gitignore')

export default defineConfig([
  {
    files: ['**/*.{cjs,js}'],
    extends: [
      eslint.configs.recommended,
      pluginImport.flatConfigs.recommended,
      pluginImport.flatConfigs.typescript,
      pluginJsdoc.configs['flat/recommended-typescript-flavor'],
      pluginPromise.configs['flat/recommended'],
      configPrettier
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        projectService: true,
        tsconfigRootDir: rootPath
      }
    },
    rules: {
      // Turn off rules that are handled by TypeScript
      // https://typescript-eslint.io/troubleshooting/typed-linting/performance/#eslint-plugin-import
      'import/default': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/no-cycle': 'off',
      'import/no-deprecated': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/no-unused-modules': 'off',

      // Always import Node.js packages from `node:*`
      'import/enforce-node-protocol-usage': ['error', 'always'],

      // Check import or require statements are A-Z ordered
      'import/order': [
        'error',
        {
          'alphabetize': { order: 'asc' },
          'newlines-between': 'always'
        }
      ],

      // Check for valid formatting
      'jsdoc/check-line-alignment': [
        'warn',
        'never',
        {
          wrapIndent: '  '
        }
      ],

      // JSDoc blocks are optional but must be valid
      'jsdoc/require-jsdoc': [
        'error',
        {
          enableFixer: false,
          require: {
            FunctionDeclaration: false
          }
        }
      ],

      // Require hyphens before param description
      // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
      'jsdoc/require-hyphen-before-param-description': 'warn',

      // JSDoc @param required in (optional) blocks but
      // @param description is not necessary by default
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-param': 'off',

      // JSDoc @returns is optional
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-returns': 'off',

      // Maintain new line after description
      'jsdoc/tag-lines': [
        'warn',
        'never',
        {
          startLines: 1
        }
      ],

      // Automatically use template strings
      'no-useless-concat': 'error',
      'prefer-template': 'error'
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: true
      }
    }
  },
  {
    // Configure ESLint for ES modules
    files: ['**/*.js'],
    rules: {
      'import/extensions': [
        'error',
        'always',
        {
          ignorePackages: true,
          pattern: {
            cjs: 'always',
            js: 'always',
            mjs: 'always'
          }
        }
      ]
    }
  },
  {
    // Configure ESLint for CommonJS modules
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  },
  {
    // Configure ESLint for Node.js
    files: ['**/*.{cjs,js}'],
    ignores: [
      'lib/javascripts/**/*.js',
      'testapp/app/javascripts/**/*.js',
      '!**/*.test.js'
    ],
    extends: [
      pluginTypeScript.configs.strict,
      pluginTypeScript.configs.stylistic,
      pluginNode.configs['flat/recommended']
    ],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    // Configure ESLint for browsers
    files: ['lib/javascripts/**/*.js', 'testapp/app/javascripts/**/*.js'],
    ignores: ['**/*.test.js'],
    extends: [
      pluginTypeScript.configs.strictTypeChecked,
      pluginTypeScript.configs.stylisticTypeChecked,
      pluginESx.configs['flat/restrict-to-es2015']
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // Note: Allow ES2015 for import/export syntax
        ecmaVersion: 2015
      }
    }
  },
  {
    // Configure ESLint in test files
    files: ['**/*.test.js'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      'promise/always-return': 'off',
      'promise/catch-or-return': 'off'
    }
  },
  {
    // Configure ESLint in Markdown files
    files: ['**/*.md'],
    extends: [pluginMarkdown.configs.processor],
    language: 'markdown/gfm'
  },
  {
    // Configure ESLint in Markdown code blocks
    files: ['**/*.md/*.{cjs,js}'],
    extends: [pluginTypeScript.configs.disableTypeChecked],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'n/no-missing-import': ['error', { resolvePaths: ['./testapp'] }],
      'no-undef': 'off'
    }
  },
  globalIgnores([
    '**/public/**',

    // Enable dotfile linting
    '!.*',
    'node_modules',
    'node_modules/.*',

    // Prevent CHANGELOG history changes
    'CHANGELOG.md'
  ]),
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns')
])
