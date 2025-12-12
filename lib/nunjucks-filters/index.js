import { formatNhsNumber } from './format-nhs-number.js'
import { log } from './log.js'
import { startsWith } from './starts-with.js'

// Use this to add all the filters at once
export function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('startsWith', startsWith)
}

export { formatNhsNumber, log, startsWith }
