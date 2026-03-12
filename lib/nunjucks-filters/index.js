import { formatDate } from './format-date.js'
import { formatNhsNumber } from './format-nhs-number.js'
import { log } from './log.js'
import { startsWith } from './starts-with.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatDate', formatDate)
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('startsWith', startsWith)

  return nunjucksEnv
}

export { formatDate, formatNhsNumber, log, startsWith }

/**
 * @import { Environment } from 'nunjucks'
 */
