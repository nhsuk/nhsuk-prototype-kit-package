import { formatNhsNumber } from './format-nhs-number.js'
import { log } from './log.js'
import { normaliseSpaces } from './normalise-spaces.js'
import { startsWith } from './starts-with.js'
import { trimSpaces } from './trim-spaces.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('normaliseSpaces', normaliseSpaces)
  nunjucksEnv.addFilter('startsWith', startsWith)
  nunjucksEnv.addFilter('trimSpaces', trimSpaces)
}

export { formatNhsNumber, log, normaliseSpaces, startsWith, trimSpaces }

/**
 * @import { Environment } from 'nunjucks'
 */
