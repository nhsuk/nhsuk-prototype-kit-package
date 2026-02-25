import { dirname, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'

import nhsukFrontendPkg from 'nhsuk-frontend/package.json' with { type: 'json' }

import pkg from '../package.json' with { type: 'json' }

// Application path
export const appPath = cwd()

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
 * Node.js module path
 */
export const modulePath = dirname(nhsukFrontendPath)
export const moduleBase = resolve(modulePath, '..')

/**
 * Node.js module paths
 */
export const modulePaths = Array.from(
  new Set([
    // Prototype modules
    join(appPath, 'node_modules'),

    // NHS prototype kit modules (optional)
    join(prototypeKitPath, 'node_modules'),

    // NHS prototype kit when linked (optional)
    // or when part of an npm workspace
    modulePath,
    moduleBase
  ])
)

/**
 * Nunjucks search paths
 */
export const searchPaths = [
  appPath,
  join(prototypeKitPath, 'lib/views'),
  join(nhsukFrontendPath, 'dist/nhsuk/components'),
  join(nhsukFrontendPath, 'dist/nhsuk/macros'),
  join(nhsukFrontendPath, 'dist/nhsuk'),
  join(nhsukFrontendPath, 'dist'),
  ...modulePaths
]
