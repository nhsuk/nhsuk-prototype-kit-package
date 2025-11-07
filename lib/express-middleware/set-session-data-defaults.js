/**
 * Set session data defaults
 */
function setSessionDataDefaults(options) {
  return function _setSessionDataDefaults(req, res, next) {
    if (!req.session.data) {
      req.session.data = {}
    }

    req.session.data = Object.assign({}, options.defaults, req.session.data)

    next()
  }
}

module.exports = setSessionDataDefaults
