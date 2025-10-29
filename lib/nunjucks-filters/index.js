const formatNhsNumber = require('./format-nhs-number')
const log = require('./log')
const startsWith = require('./starts-with')

// Use this to add all the filters at once
function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('formatNhsNumber', formatNhsNumber)
  nunjucksEnv.addFilter('log', log)
  nunjucksEnv.addFilter('startsWith', startsWith)
}

module.exports = {
  addAll,
  formatNhsNumber,
  log,
  startsWith
}
