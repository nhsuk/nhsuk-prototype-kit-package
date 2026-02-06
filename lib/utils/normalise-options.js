import { join } from 'node:path'

import express from 'express'
import nunjucks from 'nunjucks'

import {
  nhsukFrontendPath,
  prototypeKitPath
} from '../nhsuk-prototype-kit.config.js'

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
        join(prototypeKitPath, 'lib/views'),
        join(nhsukFrontendPath, 'dist/nhsuk/components'),
        join(nhsukFrontendPath, 'dist/nhsuk/macros'),
        join(nhsukFrontendPath, 'dist/nhsuk'),
        join(nhsukFrontendPath, 'dist')
      ])

    nunjucksEnv = nunjucks.configure(viewsPath, {
      express: app,
      noCache: true
    })
  } else {
    nunjucksEnv.express(app)
  }

  return { ...options, app, viewsPath, nunjucks: nunjucksEnv }
}

/**
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
