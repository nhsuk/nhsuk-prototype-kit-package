/**
 * Set query parser to 'extended'
 *
 * @param {Express} app
 */
export function setQueryParser(app) {
  // Adds support for parsing nested query strings
  // https://github.com/nhsuk/nhsuk-prototype-kit/issues/644
  app.set('query parser', 'extended')
}

/**
 * @import { Express } from 'express'
 */
