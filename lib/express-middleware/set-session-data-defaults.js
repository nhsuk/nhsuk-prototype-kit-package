/**
 * Set session data defaults
 * @param {Object} options - Configuration options
 * @param {Object} options.defaults - Default values to merge into session data
 * @returns {Function} Express middleware function
 */
function setSessionDataDefaults(options = {}) {
  // Validate options at middleware creation time (not per-request)
  if (!options.defaults || typeof options.defaults !== 'object') {
    throw new TypeError('options.defaults must be an object')
  }

  // Freeze defaults to prevent accidental mutations
  const defaults = Object.freeze({ ...options.defaults })

  return function _setSessionDataDefaults(req, res, next) {
    // Guard clause: ensure session exists
    if (!req.session) {
      return next(new Error('Session middleware must be initialized before setSessionDataDefaults'))
    }

    // Initialize session.data if it doesn't exist
    if (!req.session.data) {
      req.session.data = {}
    }

    // Merge defaults with existing data (existing data takes precedence)
    req.session.data = { ...defaults, ...req.session.data }

    next()
  }
}

module.exports = setSessionDataDefaults
