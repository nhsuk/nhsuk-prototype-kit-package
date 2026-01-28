import * as middleware from './middleware/index.js'
import { NHSPrototypeKit } from './nhsuk-prototype-kit.js'
import * as nunjucksFilters from './nunjucks-filters/index.js'
import * as utils from './utils/index.js'

export default NHSPrototypeKit
export { middleware, nunjucksFilters, utils }

/**
 * @typedef {import('./nhsuk-prototype-kit.js').Options} Options
 * @typedef {import('./nhsuk-prototype-kit.js').ApplicationData} ApplicationData
 * @typedef {import('./nhsuk-prototype-kit.js').ApplicationLocals} ApplicationLocals
 */
