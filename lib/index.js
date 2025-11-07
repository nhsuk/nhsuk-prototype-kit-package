const { join } = require('node:path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const autoRouting = require('./express-middleware/auto-routing')
const autoStoreData = require('./express-middleware/auto-store-data')
const authenticate = require('./express-middleware/authentication')
const productionHeaders = require('./express-middleware/production-headers')
const resetSessionData = require('./express-middleware/reset-session-data')
const setCurrentPageInLocals = require('./express-middleware/set-current-page-in-locals')

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
  
    req.app.use(setCurrentPageInLocals)
  
    if (process.env.NODE_ENV === 'production') {
      req.app.use(productionHeaders)
      req.app.use(authenticate)
    }
  
    req.app.use(resetSessionData)
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
  options.express.use(NHSPrototypeKit({
    routes: routes
  }))
}

module.exports = NHSPrototypeKit
