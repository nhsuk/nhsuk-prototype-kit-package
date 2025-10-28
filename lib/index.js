const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const autoRouting = require('./express-middleware/auto-routing')
const autoStoreData = require('./express-middleware/auto-store-data')
const authenticate = require('./express-middleware/authentication')
const productionHeaders = require('./express-middleware/production-headers')
const resetSessionData = require('./express-middleware/reset-session-data')
const setCurrentPageInLocals = require('./express-middleware/set-current-page-in-locals')

const nunjucksFilters = require('./nunjucks-filters/index')

const NHSPrototypeKit = function (req, res, next) {
  req.app.use(cookieParser())
  req.app.use(bodyParser.urlencoded())

  req.app.use(setCurrentPageInLocals)

  if (process.env.NODE_ENV === 'production') {
    req.app.use(productionHeaders)
    req.app.use(authenticate)
  }

  req.app.use(resetSessionData)
  req.app.use(autoStoreData)
  req.app.use(autoRouting.matchRoutes)
  next()
}

NHSPrototypeKit.nunjucksFilters = nunjucksFilters

// This both adds all filters to the Nunjucks environment
// and uses the Express middleware
NHSPrototypeKit.init = function (app, nunjucksEnv) {
  NHSPrototypeKit.nunjucksFilters.addAll(nunjucksEnv)
  app.use(NHSPrototypeKit)
}

module.exports = NHSPrototypeKit
