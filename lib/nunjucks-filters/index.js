import { formatCurrency } from './format-currency.js'
import { formatNhsNumber } from './format-nhs-number.js'
import { formatNumber } from './format-number.js'
import { log } from './log.js'
import { normaliseSpaces } from './normalise-spaces.js'
import { numeric } from './numeric.js'
import { startsWith } from './starts-with.js'
import { trimSpaces } from './trim-spaces.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatCurrency', formatCurrency)
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('formatNumber', formatNumber)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('normaliseSpaces', normaliseSpaces)
  nunjucksEnv.addFilter('numeric', numeric)
  nunjucksEnv.addFilter('startsWith', startsWith)
  nunjucksEnv.addFilter('trimSpaces', trimSpaces)
}

export {
  formatCurrency,
  formatNhsNumber,
  formatNumber,
  log,
  normaliseSpaces,
  numeric,
  startsWith,
  trimSpaces
}

/**
 * @import { Environment } from 'nunjucks'
 */
