import formatNhsNumber from './format-nhs-number.js'
import log from './log.js'
import startsWith from './starts-with.js'

// Use this to add all the filters at once
function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('startsWith', startsWith)
}

export { addAll, formatNhsNumber, log, startsWith }
export default { addAll, formatNhsNumber, log, startsWith }
