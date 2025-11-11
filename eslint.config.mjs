import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
import markdown from '@eslint/markdown'
import globals from 'globals'
import neostandard, { plugins } from 'neostandard'

export default [
  {
    plugins: {
      import: importPlugin,
      jsdoc,
      markdown
    }
  },
  ...neostandard({ noStyle: true }),
  prettier,
  ...markdown.configs.recommended,
  {
    ignores: [
      '**/.cache/**',
      '**/dist/**',
      '**/vendor/**',

      // Lint dot files
      '!.*',
      'node_modules',
      'node_modules/.*',

      // Prevent CHANGELOG history changes
      'CHANGELOG.md'
    ]
  },
  {
    ...js.configs.recommended,
    ...importPlugin.flatConfigs.recommended,
    ...jsdoc.configs['flat/recommended'],
    ...plugins.n.configs['flat/recommended'],
    ...plugins.promise.configs['flat/recommended'],
    files: [
      '**/*.{cjs,js,mjs}',

      // Check markdown `*.md` contains valid code blocks
      // https://github.com/eslint/eslint-plugin-markdown#advanced-configuration
      '**/*.md/*.{cjs,js,mjs}'
    ],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaVersion: 'latest'
      }
    },
    rules: {
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

      // JSDoc blocks can use `@preserve` to prevent removal
      'jsdoc/check-tag-names': [
        'warn',
        {
          definedTags: ['preserve']
        }
      ],

      // JSDoc blocks are optional by default
      'jsdoc/require-jsdoc': 'off',

      // JSDoc @param required in (optional) blocks but
      // @param description is not necessary by default
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param': 'error',

      // Require hyphens before param description
      // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
      'jsdoc/require-hyphen-before-param-description': 'warn',

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
      'prefer-template': 'error',

      // Avoid continue and else blocks after return statements in if statements
      'no-continue': 'error',
      'no-else-return': 'error',

      // Avoid hard to read multi assign statements
      'no-multi-assign': 'error'
    }
  }
]
