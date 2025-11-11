const authenticate = require('./authentication')
const autoRouting = require('./auto-routing')
const autoStoreData = require('./auto-store-data')
const productionHeaders = require('./production-headers')
const renderPageNotFound = require('./render-page-not-found')
const resetSessionData = require('./reset-session-data')
const setCurrentPageInLocals = require('./set-current-page-in-locals')
const setSessionDataDefaults = require('./set-session-data-defaults')

module.exports = {
  autoRouting,
  autoStoreData,
  authenticate,
  productionHeaders,
  renderPageNotFound,
  resetSessionData,
  setCurrentPageInLocals,
  setSessionDataDefaults
}
