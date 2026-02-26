import { formatNhsNumber } from './format-nhs-number.js'
import { log } from './log.js'
import { startsWith } from './starts-with.js'
import { unslugify } from './unslugify.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('startsWith', startsWith)
  nunjucksEnv.addFilter('unslugify', unslugify)
}

export { formatNhsNumber, log, startsWith, unslugify }

/**
 * @import { Environment } from 'nunjucks'
 */
