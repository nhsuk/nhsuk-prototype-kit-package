import { join } from 'node:path'

import browserSync from 'browser-sync'
import express from 'express'
import nodemon from 'nodemon'
import waitOn from 'wait-on'

import { build } from './build/index.js'
import * as expressSettings from './express-settings/index.js'
import * as middleware from './middleware/index.js'
import {
  nhsukFrontendPath,
  prototypeKitPath
} from './nhsuk-prototype-kit.config.js'
import * as nunjucksFilters from './nunjucks-filters/index.js'
import * as utils from './utils/index.js'

export class NHSPrototypeKit {
  /** @type {Server | undefined} */
  server

  /**
   * @param {Pick<Options, 'app' | 'nunjucks' | 'buildOptions'>} options
   */
  constructor({ app, nunjucks, buildOptions }) {
    this.app = app
    this.nunjucks = nunjucks
    this.buildOptions = buildOptions
  }

  /**
   * This does all setup for both the Express app
   * and the Nunjucks environment
   *
   * @param {Partial<Options>} [initOptions]
   * @returns {Promise<NHSPrototypeKit | Awaited<ReturnType<typeof NHSPrototypeKit.watch>>>}
   */
  static async init(initOptions) {
    const { NODE_ENV, PROXY } = process.env
    const options = utils.normaliseOptions(initOptions)

    // In development mode, spawn via Nodemon
    if (NODE_ENV !== 'production' && !PROXY) {
      return NHSPrototypeKit.watch(options)
    }

    const { app, nunjucks } = options

    // Set all the Express settings
    expressSettings.setAll(app)

    // Add the prototype kit Nunjucks filters
    nunjucksFilters.addAll(nunjucks)

    // Add additional custom Nunjucks filters
    if (options?.filters) {
      utils.addNunjucksFilters(nunjucks, options.filters)
    }

    // Use assets from NHS.UK frontend
    app.use(
      '/nhsuk-frontend',
      express.static(join(nhsukFrontendPath, 'dist/nhsuk'))
    )

    // Use assets from lib
    app.use(
      '/nhsuk-prototype-kit-assets',
      express.static(join(prototypeKitPath, 'assets'))
    )

    // Use assets from public if buildOptions are set
    if (options?.buildOptions) {
      app.use('/', express.static('public'))
    }

    // Configure the middleware
    middleware.configure(options)

    return new NHSPrototypeKit(options)
  }

  /**
   * This function can be used to start the app
   * in watch mode, using Nodemon to restart
   *
   * @param {Options} options
   * @returns {Promise<Partial<NHSPrototypeKit> & Pick<NHSPrototypeKit, 'start'>>}
   */
  static async watch(options) {
    const { NODE_ENV } = process.env
    const port = options.app.get('port')

    let availablePort

    if (NODE_ENV !== 'production') {
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

    // Save port to environment for config files
    process.env.PORT = `${availablePort}`

    const [
      { default: browserSyncConfig, proxy },
      { default: nodemonConfig },
      { default: waitOnConfig }
    ] = await Promise.all([
      import('./browsersync.config.js'),
      import('./nodemon.config.js'),
      import('./wait-on.config.js')
    ])

    const bs = browserSync.create()

    return {
      async start() {
        nodemon(nodemonConfig)
          .on('log', ({ colour, type }) => {
            if (type === 'error' || type === 'fail') {
              console.error(colour)
            }
          })

          .on('start', () =>
            waitOn(waitOnConfig, (error) => {
              if (error) {
                console.error(error.message)
              }

              return bs.active
                ? bs.reload() // Reload only when active
                : bs.init(browserSyncConfig)
            })
          )

          .on('quit', () => {
            bs.exit()
            proxy.close(() => {
              return process.kill(process.pid, 'SIGINT')
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
    const { NODE_ENV } = process.env
    const port = this.app.get('port')

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
    await new Promise((resolve, reject) => {
      this.server?.close((error) => {
        if (error) {
          reject(error)
          return
        }

        resolve(undefined)
      })

      delete this.server
    })

    process.kill(process.pid, 'SIGINT')
  }

  // This function can be used to compile the frontend assets
  async build() {
    const { NODE_ENV } = process.env

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
 * @property {NunjucksFilters | ((env: Environment) => NunjucksFilters)} [filters] - Additional custom Nunjucks filters
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
 * @import { NunjucksFilters } from './utils/add-nunjucks-filters.js'
 */
