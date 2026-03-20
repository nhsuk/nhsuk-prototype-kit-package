/**
 * Set Nunjucks environment
 *
 * @param {Express} app
 * @param {Pick<Options, 'nunjucks'>} options
 */
export function setNunjucksEnv(app, options) {
  if (app.get('nunjucksEnv')) {
    return app
  }

  return app.set('nunjucksEnv', options.nunjucks)
}

/**
 * @import { Express } from 'express'
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
