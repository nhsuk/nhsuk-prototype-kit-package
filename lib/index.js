const { join } = require('node:path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const expressMiddleware = require('./express-middleware')
const nunjucksFilters = require('./nunjucks-filters')
const expressSettings = require('./express-settings')

const NHSPrototypeKit = function (options) {
  return function (req, res, next) {
    const { app } = req
    const serviceName = options.serviceName || 'Service name goes here'

    app.use(cookieParser())
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    )

    // Session uses service name to avoid clashes with other prototypes
    const sessionName =
      'nhsuk-prototype-kit-' +
      new TextEncoder()
        .encode(serviceName)
        .reduce((hex, byte) => hex + byte.toString(16).padStart(2, '0'), '')

    app.use(
      session({
        secret: sessionName,
        name: sessionName,
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 1000 * 60 * 60 * 4 // 4 hours
        }
      })
    )

    app.use(expressMiddleware.setCurrentPageInLocals)

    res.locals.serviceName = serviceName

    if (process.env.NODE_ENV === 'production') {
      app.use(expressMiddleware.productionHeaders)
      app.use(expressMiddleware.authenticate)
    }

    app.use(expressMiddleware.resetSessionData)

    if (options.sessionDataDefaults) {
      app.use(
        expressMiddleware.setSessionDataDefaults({
          defaults: options.sessionDataDefaults
        })
      )
    }
    app.use(expressMiddleware.autoStoreData)

    if (options.locals) {
      app.use(options.locals)
    }

    if (options.routes) {
      app.use(options.routes)
    }
    app.use(expressMiddleware.autoRouting.matchRoutes)
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
