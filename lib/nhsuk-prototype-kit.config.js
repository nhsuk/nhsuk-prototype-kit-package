import { dirname, join } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'

import nhsukFrontendPkg from 'nhsuk-frontend/package.json' with { type: 'json' }

import pkg from '../package.json' with { type: 'json' }

/**
 * NHS prototype kit path
 */
export const prototypeKitPath = dirname(import.meta.dirname)

/**
 * NHS prototype kit version
 */
export const prototypeKitVersion = `v${pkg.version}`

/**
 * NHS.UK frontend path
 */
export const nhsukFrontendPath = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-frontend/package.json'))
)

/**
 * NHS.UK frontend version
 */
export const nhsukFrontendVersion = `v${nhsukFrontendPkg.version}`

/**
 * Node.js module paths
 */
export const modulePaths = Array.from(
  new Set([dirname(nhsukFrontendPath), join(cwd(), 'node_modules')])
)

/**
 * Nunjucks search paths
 */
export const searchPaths = [
  join(prototypeKitPath, 'lib/views'),
  join(nhsukFrontendPath, 'dist/nhsuk/components'),
  join(nhsukFrontendPath, 'dist/nhsuk/macros'),
  join(nhsukFrontendPath, 'dist/nhsuk'),
  join(nhsukFrontendPath, 'dist')
]
