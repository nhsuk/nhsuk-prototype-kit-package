/**
 * Deep copy plain objects and arrays, passing other values
 * (such as functions or dates) through unchanged
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
function copyPlainObjectsAndArrays(value) {
  if (Array.isArray(value)) {
    return /** @type {T} */ (value.map(copyPlainObjectsAndArrays))
  }

  if (
    value !== null &&
    typeof value === 'object' &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value))
  ) {
    return /** @type {T} */ (
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          copyPlainObjectsAndArrays(item)
        ])
      )
    )
  }

  return value
}

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

  // Freeze top-level defaults (nested values are copied per request below)
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
    // Copy nested defaults so changes in one session can't leak into others
    req.session.data = {
      ...copyPlainObjectsAndArrays(defaults),
      ...req.session.data
    }

    next()
  }
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
