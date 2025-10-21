const bodyParser = require('body-parser');

const autoRouting = require('./express-middleware/auto-routing')
const autoStoreData = require('./express-middleware/auto-store-data')
const authenticate = require('./express-middleware/authentication')
const production = require('./express-middleware/production')
const resetSessionData = require('./express-middleware/reset-session-data')

const nunjucksFilters = require('./nunjucks-filters/index')

const NHSPrototypeKit = function (req, res, next) {

  const urlencodedParser = bodyParser.urlencoded()

  urlencodedParser(req, res, function() {

    if (process.env.NODE_ENV === 'production') {

      production(req, res, function() {
        authenticate(req, res, function() {      
          resetSessionData(req, res, function() {
            autoStoreData(req, res, function() {
              autoRouting.matchRoutes(req, res, function() {
                next()
              })
            })
          })
        })
      })

    } else {

      resetSessionData(req, res, function() {
        autoStoreData(req, res, function() {
          autoRouting.matchRoutes(req, res, function() {
            next()
          })
        })
      })

    }
  })  
}

NHSPrototypeKit.nunjucksFilters = nunjucksFilters

// This both adds all filters to the Nunjucks environment
// and uses the Express middleware
NHSPrototypeKit.init = function(app, nunjucksEnv) {
  NHSPrototypeKit.nunjucksFilters.addAll(nunjucksEnv)
  app.use(NHSPrototypeKit)
}

module.exports = NHSPrototypeKit
