/**
 * Set query parser to 'extended'
 *
 * @param app
 */
function setQueryParser(app) {
  // Adds support for parsing nested query strings
  // https://github.com/nhsuk/nhsuk-prototype-kit/issues/644
  app.set('query parser', 'extended')
}

module.exports = setQueryParser
