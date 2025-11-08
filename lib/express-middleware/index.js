const autoRouting = require('./auto-routing')
const autoStoreData = require('./auto-store-data')
const authenticate = require('./authentication')
const productionHeaders = require('./production-headers')
const resetSessionData = require('./reset-session-data')
const setCurrentPageInLocals = require('./set-current-page-in-locals')
const setSessionDataDefaults = require('./set-session-data-defaults')

module.exports = {
  autoRouting,
  autoStoreData,
  authenticate,
  productionHeaders,
  resetSessionData,
  setCurrentPageInLocals,
  setSessionDataDefaults
}
