/**
 * Set app views paths
 *
 * These are the only paths used for auto-routing. Additional Nunjucks
 * search paths (for layouts, macros, components etc) are configured
 * on the Nunjucks environment instead.
 *
 * @param {Express} app
 * @param {Partial<Pick<Options, 'viewsPath'>>} options
 */
export function setViews(app, options) {
  const viewsPath = [options.viewsPath ?? []].flat()

  // Keep the Express.js default views path if none are provided
  if (!viewsPath.length) {
    return app
  }

  return app.set('views', viewsPath)
}

/**
 * @import { Express } from 'express'
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
