const { join } = require('node:path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const autoRouting = require('./express-middleware/auto-routing')
const autoStoreData = require('./express-middleware/auto-store-data')
const authenticate = require('./express-middleware/authentication')
const productionHeaders = require('./express-middleware/production-headers')
const resetSessionData = require('./express-middleware/reset-session-data')
const setCurrentPageInLocals = require('./express-middleware/set-current-page-in-locals')
const setSessionDataDefaults = require('./express-middleware/set-session-data-defaults')

const nunjucksFilters = require('./nunjucks-filters/index')
const expressSettings = require('./express-settings/index')

const NHSPrototypeKit = function (options) {
  return function (req, res, next) {
    req.app.use(cookieParser())
    req.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    )

    req.app.use(
      session({
        secret: 'nhsuk-prototype-kit-secret',
        name: 'nhsuk-prototype-kit-session',
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 1000 * 60 * 60 * 4 // 4 hours
        }
      })
    )

    req.app.use(setCurrentPageInLocals)

    if (process.env.NODE_ENV === 'production') {
      req.app.use(productionHeaders)
      req.app.use(authenticate)
    }

    req.app.use(resetSessionData)

    if (options.sessionDataDefaults) {
      req.app.use(
        setSessionDataDefaults({
          defaults: options.sessionDataDefaults
        })
      )
    }
    req.app.use(autoStoreData)

    if (options.routes) {
      req.app.use(options.routes)
    }
    req.app.use(autoRouting.matchRoutes)
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
      routes: options.routes,
      sessionDataDefaults: options.sessionDataDefaults,
      sessionName: options.sessionName
    })
  )
}

module.exports = NHSPrototypeKit
