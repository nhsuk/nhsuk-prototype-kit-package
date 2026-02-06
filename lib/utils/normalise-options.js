import { join } from 'node:path'

import express from 'express'
import nunjucks from 'nunjucks'

import { modules } from '../nhsuk-prototype-kit.config.js'

/**
 * Normalise prototype kit options
 *
 * @param {Partial<Options>} [options]
 * @returns {Options}
 */
export function normaliseOptions(options = {}) {
  const { NODE_ENV, PORT } = process.env
  let { app = express(), nunjucks: nunjucksEnv, viewsPath = [] } = options

  // Set default port
  if (PORT || (NODE_ENV === 'production' && !app.get('port'))) {
    app.set('port', parseInt(PORT ?? '3000', 10))
  }

  if (!nunjucksEnv) {
    viewsPath = [viewsPath]
      .flat()
      .concat([
        join(modules['nhsuk-prototype-kit'].path, 'lib/views'),
        join(modules['nhsuk-frontend'].path, 'dist/nhsuk/components'),
        join(modules['nhsuk-frontend'].path, 'dist/nhsuk/macros'),
        join(modules['nhsuk-frontend'].path, 'dist/nhsuk'),
        join(modules['nhsuk-frontend'].path, 'dist')
      ])

    nunjucksEnv = nunjucks.configure(viewsPath, {
      express: app,
      noCache: true,
      lstripBlocks: true, // Remove leading spaces from a block/tag
      trimBlocks: true // Remove trailing newlines from a block/tag
    })
  } else {
    nunjucksEnv.express(app)
  }

  return { ...options, app, viewsPath, nunjucks: nunjucksEnv }
}

/**
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
