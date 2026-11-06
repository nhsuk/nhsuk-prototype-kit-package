import { isObject } from 'nhsuk-frontend'

import { shouldIgnoreField } from './auto-store-data.js'

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

  // Clone defaults so changes in one session can't leak into others
  defaults = structuredClone(defaults ?? {})

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
    for (const [key, value] of Object.entries(defaults)) {
      if (!(Object.hasOwn(req.session.data, key) || shouldIgnoreField(key))) {
        req.session.data[key] = structuredClone(value)
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
