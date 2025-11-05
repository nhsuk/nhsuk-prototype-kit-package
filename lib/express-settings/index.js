const setQueryParser = require('./query-parser')
const setTrustProxy = require('./trust-proxy')
const setViewEngine = require('./view-engine')

function setAll(app) {
  setQueryParser(app)
  setTrustProxy(app)
  setViewEngine(app)
}

module.exports = {
  setAll,
  setQueryParser,
  setTrustProxy,
  setViewEngine
}
