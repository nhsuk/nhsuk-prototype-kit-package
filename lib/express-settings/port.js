/**
 * Set port number
 *
 * @param {Express} app
 */
export function setPort(app) {
  const { PORT, NODE_ENV } = process.env

  // Set default port
  if (PORT || (NODE_ENV === 'production' && !app.get('port'))) {
    app.set('port', parseInt(PORT ?? '3000', 10))
  }

  return app
}

/**
 * @import { Express } from 'express'
 */
