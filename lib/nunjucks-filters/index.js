import { formatNhsNumber } from './format-nhs-number.js'
import { log } from './log.js'
import { normaliseSpaces } from './normalise-spaces.js'
import { startsWith } from './starts-with.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('normaliseSpaces', normaliseSpaces)
  nunjucksEnv.addFilter('startsWith', startsWith)
}

export { formatNhsNumber, log, normaliseSpaces, startsWith }

/**
 * @import { Environment } from 'nunjucks'
 */
