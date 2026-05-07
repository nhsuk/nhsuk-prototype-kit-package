import { NunjucksAutoRoutingView } from '../express/nunjucks-auto-routing-view.js'

/**
 * Set the view engine
 *
 * @param {Express} app
 */
export function setViewEngine(app) {
  const nunjucksEnv = /** @type {Environment | undefined} */ (
    app.get('nunjucksEnv')
  )

  // Add Nunjucks view engines
  if (nunjucksEnv) {
    app.engine('html', nunjucksEnv.render.bind(nunjucksEnv))
    app.engine('njk', nunjucksEnv.render.bind(nunjucksEnv))
  }

  // Set auto-routing view and default extension
  app.set('view', NunjucksAutoRoutingView)
  app.set('view engine', 'html')

  return app
}

/**
 * @import { Express } from 'express'
 * @import { Environment } from 'nunjucks'
 */
