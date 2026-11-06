import { isObject } from 'nhsuk-frontend'

/**
 * Set session data with optional defaults
 *
 * @param {ObjectNested} [defaults] - Default values to merge into session data
 */
export function setSessionData(defaults) {
  // Validate options at middleware creation time (not per-request)
  if (!!defaults && !isObject(defaults)) {
    throw new TypeError('options.sessionDataDefaults must be an object')
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  return function _setSessionData(req, res, next) {
    if (!req.session) {
      return next(new Error('Session middleware is not initialised'))
    }

    // Initialise session.data if it doesn't exist
    if (!isObject(req.session.data)) {
      req.session.data = {}
    }

    // Merge defaults with existing data (existing data takes precedence)
    if (defaults) {
      req.session.data = {
        ...defaults,
        ...req.session.data
      }
    }

    next()
  }
}

/**
 * Set session data defaults (deprecated)
 *
 * @deprecated
 * @param {object} [options] - Configuration options
 * @param {ObjectNested} options.defaults - Default values to merge into session data
 */
export function setSessionDataDefaults(options) {
  return setSessionData(options?.defaults)
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import { ObjectNested } from 'nhsuk-frontend'
 */
