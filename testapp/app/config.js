import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import nunjucks from 'nunjucks'

/**
 * Service name
 */
export const serviceName = 'Test service'

/**
 * NHS prototype kit path
 */
export const prototypeKitLibPath = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-prototype-kit'))
)

/**
 * NHS.UK frontend package path
 */
export const nhsukFrontendPath = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-frontend/package.json'))
)

/**
 * Nunjucks search paths
 */
export const viewsPath = [
  'app/views',
  join(prototypeKitLibPath, 'views'),
  join(nhsukFrontendPath, 'dist/nhsuk/components'),
  join(nhsukFrontendPath, 'dist/nhsuk/macros'),
  join(nhsukFrontendPath, 'dist/nhsuk'),
  join(nhsukFrontendPath, 'dist')
]

/**
 * Nunjucks environment
 */
export const nunjucksEnv = nunjucks.configure(viewsPath, {
  noCache: true,
  lstripBlocks: true, // Remove leading spaces from a block/tag
  trimBlocks: true // Remove trailing newlines from a block/tag
})

/**
 * Build options for esbuild
 *
 * @type {BuildOptions}
 */
export const buildOptions = {
  entryPoints: ['app/stylesheets/*.scss', 'app/javascripts/*.js']
}

/**
 * @import { BuildOptions } from 'esbuild'
 */
