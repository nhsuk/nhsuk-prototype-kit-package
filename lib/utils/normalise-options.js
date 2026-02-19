import { join } from 'node:path'

import express from 'express'
import matter from 'gray-matter'
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
      noCache: true,
      lstripBlocks: true, // Remove leading spaces from a block/tag
      trimBlocks: true // Remove trailing newlines from a block/tag
    })
  } else {
    nunjucksEnv.express(app)
  }

  nunjucksEnv.on('load', function (name, source) {
    let { content, data } = matter(source.src)

    const entries = Object.entries(data)

    // Add front matter variables
    if (entries.length) {
      for (const [key, value] of entries) {
        content = `{%- set ${key} = ${normaliseValue(value)} -%}\n${content}`
      }
    }

    // Remove front matter from source
    source.src = content
  })

  return { ...options, app, viewsPath, nunjucks: nunjucksEnv }
}

/**
 * @param {unknown} input
 */
export function normaliseValue(input) {
  let output = 'null'

  switch (typeof input) {
    case 'boolean':
    case 'number':
      output = `${input}`
      break

    case 'string':
      output = `"${input.replaceAll('"', '\\"')}"`
      break

    case 'object': {
      if (input) {
        output = JSON.stringify(input, undefined, 2)
          .replaceAll('<', '\\u003c')
          .replaceAll('>', '\\u003e')
          .replaceAll('&', '\\u0026')
          .replaceAll("'", '\\u0027')
      }

      break
    }
  }

  return output
}

/**
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
