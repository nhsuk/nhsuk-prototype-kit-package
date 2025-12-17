import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import browserSync from 'browser-sync'
import express from 'express'
import httpProxy from 'http-proxy-node16'

import { build } from './build/index.js'
import * as expressSettings from './express-settings/index.js'
import * as middleware from './middleware/index.js'
import * as nunjucksFilters from './nunjucks-filters/index.js'
import * as utils from './utils/index.js'

export function NHSPrototypeKit({ express, nunjucks, config, buildOptions }) {
  this.express = express
  this.nunjucks = nunjucks
  this.config = config
  this.buildOptions = buildOptions
}

// NHS.UK frontend package path
const frontendPath = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-frontend/package.json'))
)

NHSPrototypeKit.nunjucksFilters = nunjucksFilters
NHSPrototypeKit.utils = utils
NHSPrototypeKit.middleware = middleware

// This does all setup for both the Express app
// and the Nunjucks environment
NHSPrototypeKit.init = function (options) {
  // Set all the Express settings
  expressSettings.setAll(options.express)

  // Add the prototype kit view path to Nunjucks environment
  const prototypeKitViewsPath = join(import.meta.dirname, 'views')
  options.nunjucks.loaders[0].searchPaths.push(prototypeKitViewsPath)

  // Add the prototype kit Nunjucks filters
  NHSPrototypeKit.nunjucksFilters.addAll(options.nunjucks)

  // Use assets from NHS.UK frontend
  options.express.use(
    '/nhsuk-frontend',
    express.static(join(frontendPath, 'dist/nhsuk'))
  )

  // Use assets from lib
  options.express.use(
    '/nhsuk-prototype-kit-assets',
    express.static(join(import.meta.dirname, 'assets'))
  )

  // Use assets from public if buildOptions are set
  if (options.buildOptions) {
    options.express.use('/', express.static('public'))
  }

  // Use all the middleware
  NHSPrototypeKit.middleware.all({
    serviceName: options.serviceName,
    express: options.express,
    routes: options.routes,
    locals: options.locals,
    sessionDataDefaults: options.sessionDataDefaults
  })

  return new NHSPrototypeKit({
    express: options.express,
    nunjucks: options.nunjucks,
    config: options.config,
    buildOptions: options.buildOptions
  })
}

// This function can be used to start the app
//
// Unless the app is being run in production, it will
// check that the port is available first and ask
// to switch to a different one if not.
NHSPrototypeKit.prototype.start = async function (port) {
  const nodeEnv = process.env.NODE_ENV || 'development'
  port = parseInt(port || process.env.PORT, 10) || 2000
  let availablePort = port

  if (nodeEnv === 'development') {
    try {
      availablePort = await NHSPrototypeKit.utils.findAvailablePort(port)
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

  this.express.listen(availablePort, () => {
    if (nodeEnv === 'production') {
      console.info(`Running on port ${availablePort}`)
    } else {
      const bs = browserSync.create()

      // We create our own proxy server here
      // as the default proxy option does not work
      // on GitHub Codespaces
      const proxy = httpProxy.createProxyServer({
        target: `http://localhost:${availablePort}`,
        changeOrigin: true,
        xfwd: true
      })

      bs.init({
        port: availablePort,
        files: ['views/**/*.*', 'assets/**/*.*'],
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
  })
}

// This function can be used to compile the frontend assets
NHSPrototypeKit.prototype.build = async function () {
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
