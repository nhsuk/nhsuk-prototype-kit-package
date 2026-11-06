import { isObject } from 'nhsuk-frontend'

/**
 * Set session data defaults
 *
 * @param {object} [options] - Configuration options
 * @param {ObjectNested} options.defaults - Default values to merge into session data
 */
export function setSessionDataDefaults(options) {
  // Validate options at middleware creation time (not per-request)
  if (!isObject(options?.defaults)) {
    throw new TypeError('options.defaults must be an object')
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  return function _setSessionDataDefaults(req, res, next) {
    // Guard clause: ensure session exists
    if (!req.session) {
      return next(
        new Error(
          'Session middleware must be initialised before setSessionDataDefaults'
        )
      )
    }

    // Initialise session.data if it doesn't exist
    if (!isObject(req.session.data)) {
      req.session.data = {}
    }

    // Merge defaults with existing data (existing data takes precedence)
    req.session.data = { ...options.defaults, ...req.session.data }

    next()
  }
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import { ObjectNested } from 'nhsuk-frontend'
 */
