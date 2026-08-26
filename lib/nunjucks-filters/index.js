import { formatDate } from './format-date.js'
import { formatNhsNumber } from './format-nhs-number.js'
import { formatPostcode } from './format-postcode.js'
import { formatTime, formatTime24Hour } from './format-time.js'
import { log } from './log.js'
import { startsWith } from './starts-with.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatDate', formatDate)
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('formatPostcode', formatPostcode)
  nunjucksEnv.addFilter('formatTime', formatTime)
  nunjucksEnv.addFilter('formatTime24Hour', formatTime24Hour)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('startsWith', startsWith)

  return nunjucksEnv
}

export {
  formatDate,
  formatNhsNumber,
  formatPostcode,
  formatTime,
  formatTime24Hour,
  log,
  startsWith
}

/**
 * @import { Environment } from 'nunjucks'
 */
