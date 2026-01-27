import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import browserSync from 'browser-sync'
import express from 'express'
import httpProxy from 'http-proxy-node16'
import nodemon from 'nodemon'
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
   * @returns {Promise<NHSPrototypeKit | ReturnType<typeof NHSPrototypeKit.watch>>}
   */
  static async init(options) {
    const { NODE_ENV = 'development', PROXY } = process.env

    // In development mode, spawn via Nodemon
    if (NODE_ENV === 'development' && !PROXY) {
      return NHSPrototypeKit.watch()
    }

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
   * in watch mode, using Nodemon to restart
   *
   * @param {number} [port]
   * @param {Partial<NodemonSettings>} [settings]
   * @returns {Promise<Partial<NHSPrototypeKit> & Pick<NHSPrototypeKit, 'start'>>}
   */
  static async watch(port = 3000, settings = {}) {
    const { NODE_ENV = 'development' } = process.env
    const { ignore = [] } = settings

    /** @type {number | undefined} */
    let availablePort = port

    if (NODE_ENV === 'development') {
      try {
        availablePort = await utils.findAvailablePort(port)
      } catch (error) {
        console.error(error.message)
      }
    }

    // User selected 'No'
    if (availablePort === undefined) {
      return {
        async start() {
          console.error(`Port ${port} in use`)
          process.exitCode = 0
        }
      }
    }

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

    const bs = browserSync.create()

    return {
      async start() {
        nodemon({
          env: {
            NODE_ENV,
            PORT: `${availablePort}`,
            PROXY: 'true'
          },
          ext: 'cjs,js,json',
          ignore: ['app/assets/javascript', 'public', ...ignore],
          script: 'app.js',
          signal: 'SIGINT',
          spawn: true,
          ...settings
        })
          .on('quit', () => {
            bs.exit()
            proxy.close(() => {
              process.kill(process.pid, 'SIGINT')
            })
          })
          .on('restart', () => bs.reload())
          .on('start', () => {
            if (bs.active) {
              return
            }

            bs.init({
              port: availablePort + 1,
              files: ['app/**/*.{html,njk}', 'app/assets/**/*'],
              server: { baseDir: 'app/public' },
              middleware: (req, res) => proxy.web(req, res),

              // Prevent browser mirroring
              ghostMode: false,

              // Prevent browser opening
              open: false,

              // Allow for Express.js restart
              reloadDelay: 1000,

              // Watch for file changes
              watch: true,

              // Prevent Browsersync UI
              ui: false
            })
          })
      }
    }
  }

  /**
   * This function can be used to start the app
   *
   * Unless the app is being run in production, it will
   * check that the port is available first and ask
   * to switch to a different one if not.
   *
   * @returns {Promise<this | void>}
   */
  async start() {
    const { NODE_ENV = 'development', PORT } = process.env
    const port = PORT ? parseInt(PORT, 10) : (this.app.get('port') ?? 3000)

    process.on('SIGINT', () => this.stop())
    process.on('SIGUSR2', () => this.stop())

    // Build the frontend assets (if configured)
    await this.build()

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port, (error) => {
        if (error) {
          reject(error)
          return
        }

        if (NODE_ENV === 'production') {
          console.info(`Running on port ${port}`)
        }

        resolve(this)
      })
    })
  }

  async stop() {
    this.server = await new Promise((resolve, reject) => {
      this.server?.close((error) => {
        if (error) {
          reject(error)
          return
        }

        resolve(undefined)
      })
    })

    process.kill(process.pid, 'SIGINT')
  }

  // This function can be used to compile the frontend assets
  async build() {
    const { NODE_ENV = 'development' } = process.env

    if (this.buildOptions) {
      const watch = NODE_ENV !== 'production'
      try {
        await build(watch, this.buildOptions)
      } catch (error) {
        console.error(error)
      }
    }

    return this
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
 * @import { NodemonSettings } from 'nodemon'
 * @import { Environment } from 'nunjucks'
 */
