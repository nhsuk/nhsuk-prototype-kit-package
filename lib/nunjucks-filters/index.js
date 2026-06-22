import { formatCurrency } from './format-currency.js'
import { formatDate } from './format-date.js'
import { formatNhsNumber } from './format-nhs-number.js'
import { formatNumber } from './format-number.js'
import { formatPostcode } from './format-postcode.js'
import { isNumeric } from './is-numeric.js'
import { log } from './log.js'
import { startsWith } from './starts-with.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatCurrency', formatCurrency)
  nunjucksEnv.addFilter('formatDate', formatDate)
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('formatNumber', formatNumber)
  nunjucksEnv.addFilter('formatPostcode', formatPostcode)
  nunjucksEnv.addFilter('isNumeric', isNumeric)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('startsWith', startsWith)

  return nunjucksEnv
}

export {
  formatCurrency,
  formatDate,
  formatNhsNumber,
  formatNumber,
  formatPostcode,
  isNumeric,
  log,
  startsWith
}

/**
 * @import { Environment } from 'nunjucks'
 */
