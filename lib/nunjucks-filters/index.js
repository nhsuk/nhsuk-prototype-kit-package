import { formatNhsNumber } from './format-nhs-number.js'
import { formatPostcode } from './format-postcode.js'
import { log } from './log.js'
import { startsWith } from './starts-with.js'
import { trimSpaces } from './trim-spaces.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('formatPostcode', formatPostcode)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('startsWith', startsWith)
  nunjucksEnv.addFilter('trimSpaces', trimSpaces)
}

export { formatNhsNumber, formatPostcode, log, startsWith, trimSpaces }

/**
 * @import { Environment } from 'nunjucks'
 */
