/**
 * Set session data defaults
 *
 * @param {object} options - Configuration options
 * @param {{ [key: string]: unknown }} options.defaults - Default values to merge into session data
 */
export function setSessionDataDefaults(options) {
  // Validate options at middleware creation time (not per-request)
  if (!options?.defaults || typeof options.defaults !== 'object') {
    throw new TypeError('options.defaults must be an object')
  }

  // Check defaults can be cloned now, rather than failing on every request
  try {
    structuredClone(options.defaults)
  } catch (cause) {
    throw new TypeError(
      'options.defaults must only contain values that can be cloned, such as strings, numbers, arrays and objects (not functions)',
      { cause }
    )
  }

  // Freeze top-level defaults (nested values are cloned per request below)
  const defaults = Object.freeze({ ...options.defaults })

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
          'Session middleware must be initialized before setSessionDataDefaults'
        )
      )
    }

    // Initialize session.data if it doesn't exist
    if (!req.session.data) {
      req.session.data = {}
    }

    // Merge defaults with existing data (existing data takes precedence)
    // Clone defaults so changes in one session can't leak into others
    req.session.data = { ...structuredClone(defaults), ...req.session.data }

    next()
  }
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
