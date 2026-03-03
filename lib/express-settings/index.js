import { setNunjucksEnv } from './nunjucks-env.js'
import { setPort } from './port.js'
import { setQueryParser } from './query-parser.js'
import { setTrustProxy } from './trust-proxy.js'
import { setViewEngine } from './view-engine.js'
import { setViews } from './views.js'

/**
 * Set all Express settings
 
 * @param {Express} app
 * @param {Options} options
 */
export function setAll(app, options) {
  setNunjucksEnv(app, options)
  setPort(app)
  setQueryParser(app)
  setTrustProxy(app)
  setViewEngine(app)
  setViews(app, options)

  return app
}

export {
  setNunjucksEnv,
  setPort,
  setQueryParser,
  setTrustProxy,
  setViewEngine,
  setViews
}

/**
 * @import { Express } from 'express'
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
