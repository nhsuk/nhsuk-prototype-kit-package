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
  let { nunjucks: nunjucksEnv, viewsPath = [] } = options

  const app = express()

  viewsPath = [viewsPath]
    .flat()
    .concat([
      join(prototypeKitPath, 'views'),
      join(nhsukFrontendPath, 'dist/nhsuk/components'),
      join(nhsukFrontendPath, 'dist/nhsuk/macros'),
      join(nhsukFrontendPath, 'dist/nhsuk'),
      join(nhsukFrontendPath, 'dist')
    ])

  nunjucksEnv = nunjucks.configure(viewsPath, {
    express: app,
    noCache: true
  })

  return { ...options, app, viewsPath, nunjucks: nunjucksEnv }
}

/**
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
