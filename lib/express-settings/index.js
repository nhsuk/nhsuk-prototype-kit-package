import setQueryParser from './query-parser.js'
import setTrustProxy from './trust-proxy.js'
import setViewEngine from './view-engine.js'

function setAll(app) {
  setQueryParser(app)
  setTrustProxy(app)
  setViewEngine(app)
}

export { setAll, setQueryParser, setTrustProxy, setViewEngine }
export default { setAll, setQueryParser, setTrustProxy, setViewEngine }
