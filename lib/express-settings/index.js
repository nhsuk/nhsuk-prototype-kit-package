import { setQueryParser } from './query-parser.js'
import { setTrustProxy } from './trust-proxy.js'
import { setViewEngine } from './view-engine.js'

export function setAll(app) {
  setQueryParser(app)
  setTrustProxy(app)
  setViewEngine(app)
}

export { setQueryParser, setTrustProxy, setViewEngine }
