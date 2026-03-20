/**
 * Set views search paths
 *
 * @param {Express} app
 * @param {Pick<Options, 'viewsPath'>} options
 */
export function setViews(app, options) {
  return app.set('views', options.viewsPath)
}

/**
 * @import { Express } from 'express'
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
