const { join } = require('node:path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const session = require('express-session')

const expressMiddleware = require('./express-middleware')
const expressSettings = require('./express-settings')
const nunjucksFilters = require('./nunjucks-filters')

const SESSION_COOKIE_MAX_AGE = 1000 * 60 * 60 * 4 // 4 hours

/**
 * Generate a unique session name based on the service name
 *
 * @param {string} serviceName -
 */
function generateSessionName(serviceName) {
  const hash = new TextEncoder()
    .encode(serviceName)
    .reduce((hex, byte) => hex + byte.toString(16).padStart(2, '0'), '')

  return `nhsuk-prototype-kit-${hash}`
}

/**
 * Configure session middleware
 *
 */
function configureSession(app, serviceName) {
  const sessionName = generateSessionName(serviceName)

  app.use(
    session({
      secret: sessionName,
      name: sessionName,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: SESSION_COOKIE_MAX_AGE
      }
    })
  )
}

const NHSPrototypeKit = function (options) {
  return function (req, res, next) {
    const { app } = req
    const serviceName = options.serviceName || 'Service name goes here'

    // Configure core middleware
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({ extended: true }))

    // Configure session
    configureSession(app, serviceName)

    // Set locals
    app.use(expressMiddleware.setCurrentPageInLocals)
    res.locals.serviceName = serviceName

    // Add production-specific middleware
    if (process.env.NODE_ENV === 'production') {
      app.use(expressMiddleware.productionHeaders)
      app.use(expressMiddleware.authenticate)
    }

    // Use NHS Prototype Kit static assets
    app.use(
      '/nhsuk-prototype-kit-assets',
      express.static(join(__dirname, 'assets'))
    )

    // Add reset session routes
    app.use(expressMiddleware.resetSessionData)

    // Set default session data
    if (options.sessionDataDefaults) {
      app.use(
        expressMiddleware.setSessionDataDefaults({
          defaults: options.sessionDataDefaults
        })
      )
    }

    // Set session data from GET or POST requests
    app.use(expressMiddleware.autoStoreData)

    // Set any other locals
    if (options.locals) {
      app.use(options.locals)
    }

    // Use custom routes
    if (options.routes) {
      app.use(options.routes)
    }

    // Auto-routes – this must come after custom routes
    app.use(expressMiddleware.autoRouting.matchRoutes)

    // Page not found - this must come last
    app.use(expressMiddleware.renderPageNotFound)

    next()
  }
}

NHSPrototypeKit.nunjucksFilters = nunjucksFilters

// This does all setup for both the Express app
// and the Nunjucks environment
NHSPrototypeKit.init = function (options) {
  // Set all the Express settings
  expressSettings.setAll(options.express)

  // Add the prototype kit view path to Nunjucks environment
  const prototypeKitViewsPath = join(__dirname, 'views')
  options.nunjucks.loaders[0].searchPaths.push(prototypeKitViewsPath)

  // Add the prototype kit Nunjucks filters
  NHSPrototypeKit.nunjucksFilters.addAll(options.nunjucks)

  // Add the prototype kit to Express as middleware
  options.express.use(
    NHSPrototypeKit({
      serviceName: options.serviceName,
      routes: options.routes,
      locals: options.locals,
      sessionDataDefaults: options.sessionDataDefaults
    })
  )
}

module.exports = NHSPrototypeKit
