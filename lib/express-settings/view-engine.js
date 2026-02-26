/**
 * Set the view engine
 *
 * @param {Express} app
 */
export function setViewEngine(app) {
  const nunjucksEnv = /** @type {Environment} */ (app.get('nunjucksEnv'))

  /**
   * Nunjucks render [name].html with fallbacks
   *
   * 1. Success or unknown error: Proceed with callback
   * 2. Template not found: Try to render [name].njk
   * 3. Template not found: Try to render [name]/index.html (for directory-style URLs)
   * 4. Template not found: Try to render [name]/index.njk (for directory-style URLs)
   *
   * @this {NunjucksView}
   * @param {NunjucksView} options
   * @param {TemplateCallback<string>} callback
   */
  function nunjucksRender(options, callback) {
    nunjucksEnv.render(this.name, options, (error, html) => {
      if (!error?.message?.startsWith('template not found')) {
        return callback(error, html)
      }

      // Try appending .njk if we haven't already
      if (this.name.endsWith('.html')) {
        this.name = this.name.replace('.html', '.njk')
        return nunjucksRender.call(this, options, callback)
      }

      // Try appending /index.html if we haven't already
      if (this.name.endsWith('.njk') && !this.name.endsWith('/index.njk')) {
        this.name = `${this.name.replace('.njk', '')}/index.html`
        return nunjucksRender.call(this, options, callback)
      }

      callback(error, html)
    })
  }

  app.get('view').prototype.render = nunjucksRender
  app.set('view engine', 'html')

  return app
}

/**
 * @typedef {object} NunjucksView
 * @property {string} name - Template name
 * @property {Express} path - Template path (original)
 * @property {string} defaultEngine - View engine
 * @property {string} ext - File extension
 */

/**
 * @import { Express } from 'express'
 * @import { Environment, TemplateCallback } from 'nunjucks'
 */
