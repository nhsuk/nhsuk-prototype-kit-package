import { extname } from 'node:path'

import { isTemplateNotFoundError } from '../middleware/auto-routes.js'

export class NunjucksAutoRoutingView {
  /**
   * @param {string} name
   * @param {Partial<NunjucksViewOptions>} options
   */
  constructor(name, options = {}) {
    this.defaultEngine = options.defaultEngine ?? 'html'
    this.engines = options.engines
    this.root = options.root

    this.path = name
    this.ext = extname(name)

    if (!this.ext) {
      const { defaultEngine: ext } = this

      // Get extension from default engine name
      this.ext = ext.startsWith('.') ? ext : `.${ext}`
      this.path += this.ext
    }
  }

  /**
   * Nunjucks render [name].html with fallbacks
   *
   * 1. Success or unknown error: Proceed with callback
   * 2. Template not found: Try to render [name].njk
   * 3. Template not found: Try to render [name]/index.html (for directory-style URLs)
   * 4. Template not found: Try to render [name]/index.njk (for directory-style URLs)
   *
   * @param {object} options
   * @param {NunjucksViewCallback} callback
   */
  render(options, callback) {
    const nunjucksRender =
      this.engines?.[this.ext] ?? // Try Express.js available engines
      this.engines?.[`.${this.defaultEngine}`] // Fallback to default

    if (!nunjucksRender) {
      return callback(new Error(`Failed to lookup view engine "${this.ext}"`))
    }

    nunjucksRender(this.path, options, (error, html) => {
      if (!isTemplateNotFoundError(error)) {
        return callback(error, html)
      }

      // Try appending .njk if we haven't already
      if (this.path.endsWith('.html')) {
        this.path = this.path.replace('.html', '.njk')
        return this.render.call(this, options, callback)
      }

      // Try appending /index.html if we haven't already
      if (this.path.endsWith('.njk') && !this.path.endsWith('/index.njk')) {
        this.path = `${this.path.replace('.njk', '')}/index.html`
        return this.render.call(this, options, callback)
      }

      callback(error, html)
    })
  }
}

/**
 * @typedef {object} NunjucksViewOptions
 * @property {string} [defaultEngine] - View extension (e.g. 'html')
 * @property {{ [key: string]: Environment['render'] }} engines - View engines
 * @property {string | string[]} root - View path(s)
 */

/**
 * @callback NunjucksViewCallback
 * @param {Error | null} [error]
 * @param {string | null} [html]
 * @returns {void}
 */

/**
 * @import { Environment } from 'nunjucks'
 */
