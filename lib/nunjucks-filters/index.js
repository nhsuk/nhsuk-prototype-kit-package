import { formatDate } from './format-date.js'
import { formatNhsNumber } from './format-nhs-number.js'
import { formatPostcode } from './format-postcode.js'
import { log } from './log.js'
import { startsWith } from './starts-with.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatDate', formatDate)
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('formatPostcode', formatPostcode)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('startsWith', startsWith)
}

export {
  formatDate,
  formatNhsNumber,
  formatPostcode,
  log,
  startsWith
}

/**
 * @import { Environment } from 'nunjucks'
 */
