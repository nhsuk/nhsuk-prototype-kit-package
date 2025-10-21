const bodyParser = require('body-parser');

const autoRouting = require('./express-middleware/auto-routing')
const autoStoreData = require('./express-middleware/auto-store-data')
const authenticate = require('./express-middleware/authentication')
const production = require('./express-middleware/production')
const resetSessionData = require('./express-middleware/reset-session-data')

const nunjucksFilters = require('./nunjucks-filters/index')

const NHSPrototypeKit = function (req, res, next) {

  req.app.use(bodyParser.urlencoded())

  if (process.env.NODE_ENV === 'production') {
    req.app.use(production)
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
NHSPrototypeKit.init = function(app, nunjucksEnv) {
  NHSPrototypeKit.nunjucksFilters.addAll(nunjucksEnv)
  app.use(NHSPrototypeKit)
}

module.exports = NHSPrototypeKit
