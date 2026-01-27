import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import browserSync from 'browser-sync'
import express from 'express'
import httpProxy from 'http-proxy-node16'
import nunjucks from 'nunjucks'

import { build } from './build/index.js'
import * as expressSettings from './express-settings/index.js'
import * as middleware from './middleware/index.js'
import * as nunjucksFilters from './nunjucks-filters/index.js'
import * as utils from './utils/index.js'

// NHS.UK frontend package path
const nhsukFrontendPathPrefix = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-frontend/package.json'))
)

export class NHSPrototypeKit {
  /** @type {Server | undefined} */
  server

  /**
   * @param {Options} options
   */
  constructor({ app, nunjucks, config, buildOptions }) {
    this.app = app
    this.nunjucks = nunjucks
    this.config = config
    this.buildOptions = buildOptions
  }

  /**
   * This does all setup for both the Express app
   * and the Nunjucks environment
   *
   * @param {Partial<Options>} [options]
   */
  static init(options) {
    const app = express()

    // Set all the Express settings
    expressSettings.setAll(app)

    let nunjucksViews = []

    if (options?.viewsPath) {
      nunjucksViews.push(...[options.viewsPath].flat())
    }

    // Add the prototype kit view path to Nunjucks environment
    const prototypeKitViewsPath = join(import.meta.dirname, 'views')
    nunjucksViews.push(prototypeKitViewsPath)

    const nhsukFrontendPaths = [
      join(nhsukFrontendPathPrefix, 'dist/nhsuk/components'),
      join(nhsukFrontendPathPrefix, 'dist/nhsuk/macros'),
      join(nhsukFrontendPathPrefix, 'dist/nhsuk'),
      join(nhsukFrontendPathPrefix, 'dist')
    ]

    nunjucksViews.push(...nhsukFrontendPaths)

    const nunjucksEnv = nunjucks.configure(nunjucksViews, {
      express: app,
      noCache: true
    })

    // Add the prototype kit Nunjucks filters
    nunjucksFilters.addAll(nunjucksEnv)

    // Use assets from NHS.UK frontend
    app.use(
      '/nhsuk-frontend',
      express.static(join(nhsukFrontendPathPrefix, 'dist/nhsuk'))
    )

    // Use assets from lib
    app.use(
      '/nhsuk-prototype-kit-assets',
      express.static(join(import.meta.dirname, 'assets'))
    )

    // Use assets from public if buildOptions are set
    if (options?.buildOptions) {
      app.use('/', express.static('public'))
    }

    // Configure the middleware
    middleware.configure({
      ...options,
      app,
      nunjucks: nunjucksEnv
    })

    return new NHSPrototypeKit({
      app,
      nunjucks: nunjucksEnv,
      config: options?.config,
      buildOptions: options?.buildOptions
    })
  }

  /**
   * This function can be used to start the app
   *
   * Unless the app is being run in production, it will
   * check that the port is available first and ask
   * to switch to a different one if not.
   *
   * @param {number} [port]
   */
  async start(port) {
    const nodeEnv = process.env.NODE_ENV || 'development'
    port = parseInt(`${port || process.env.PORT}`, 10) || 2000

    /** @type {number | undefined} */
    let availablePort = port

    if (nodeEnv === 'development') {
      try {
        availablePort = await utils.findAvailablePort(port)
      } catch (error) {
        console.error(error.message)
        return
      }
    }

    if (typeof availablePort !== 'number') {
      // User selected 'No'
      return
    }

    // Build the frontend assets (if configured)
    await this.build()

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(availablePort, (error) => {
        if (error) {
          reject(error)
          return
        }

        if (nodeEnv === 'production') {
          console.info(`Running on port ${availablePort}`)
        } else {
          const bs = browserSync.create()

          // We create our own proxy server here
          // as the default proxy option does not work
          // on GitHub Codespaces
          const proxy = httpProxy
            .createProxyServer({
              target: `http://localhost:${availablePort}`,
              changeOrigin: true,
              xfwd: true
            })
            .on('error', (error) => {
              console.error(error.message)
            })

          bs.init({
            port: availablePort,
            files: ['app/**/*.{html,njk}', 'app/assets/**/*'],
            middleware: (req, res) => proxy.web(req, res),
            server: {
              baseDir: new URL('public', import.meta.url).pathname
            },

            ghostMode: false,
            open: false,
            notify: true,
            watch: true,
            ui: false
          })
        }

        resolve(this.server)
      })
    })
  }

  // This function can be used to compile the frontend assets
  async build() {
    const nodeEnv = process.env.NODE_ENV || 'development'

    if (this.buildOptions) {
      const watch = nodeEnv !== 'production'
      try {
        await build(watch, this.buildOptions)
      } catch (error) {
        console.log(error)
      }
    }
  }
}

/**
 * @typedef {object} Options
 * @property {string} [serviceName] - Service name
 * @property {Express} app - Express app
 * @property {Router} [routes] - Additional custom routes
 * @property {string | string[]} [viewsPath] - Additional custom views path
 * @property {RequestHandler} [locals] - Middleware to set additional locals
 * @property {Environment} nunjucks - Nunjucks environment
 * @property {object} [config] - Configuration options
 * @property {{ sassLoadPaths?: string[], entryPoints?: string[] }} [buildOptions] - Build options
 * @property {{ [key: string]: unknown }} [sessionDataDefaults] - Default data to set in the session
 */

/**
 * @typedef {object} ApplicationData
 * @property {string} [organisationName] - Organisation name
 */

/**
 * @typedef {object} ApplicationLocals
 * @property {string} [currentPage] - Current page
 * @property {string} [organisationName] - Organisation name
 */

/**
 * @import { Server } from 'node:http'
 * @import { Express, RequestHandler, Router } from 'express'
 * @import { Environment } from 'nunjucks'
 */
