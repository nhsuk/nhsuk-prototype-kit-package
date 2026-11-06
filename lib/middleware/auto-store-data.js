import { isObject } from 'nhsuk-frontend'

// Constants for special field values and prefixes
const UNCHECKED_VALUE = '_unchecked'
const IGNORED_PREFIX = '_'

/**
 * Check if a field name should be ignored
 * (starts with underscore or is a prototype property)
 *
 * @param {string} fieldName
 * @returns {boolean}
 */
export function shouldIgnoreField(fieldName) {
  return (
    Object.hasOwn(Object.prototype, fieldName) ||
    fieldName.startsWith(IGNORED_PREFIX)
  )
}

/**
 * Remove unchecked markers from an array of values
 *
 * @param {NestedValue[]} array
 * @returns {NestedValue[]}
 */
function removeUncheckedFromArray(array) {
  return array.filter((item) => item !== UNCHECKED_VALUE)
}

/**
 * Store data from POST body or GET query in session
 *
 * @param {ObjectNested | ParsedQs} input
 * @param {ObjectNested} data
 */
function storeData(input, data) {
  if (!isObject(input)) {
    return
  }

  for (const [fieldName, fieldValue] of Object.entries(input)) {
    // Skip fields that should be ignored (e.g., _csrf)
    if (shouldIgnoreField(fieldName)) {
      continue
    }

    // Handle unchecked checkboxes - delete the field from session
    if (fieldValue === UNCHECKED_VALUE) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete data[fieldName]
      continue
    }

    // Handle arrays - remove any unchecked markers
    if (Array.isArray(fieldValue)) {
      data[fieldName] = removeUncheckedFromArray(fieldValue)
      continue
    }

    // Handle nested objects - merge recursively
    if (isObject(fieldValue)) {
      // Initialise as object if it doesn't exist or isn't an object
      if (!isObject(data[fieldName])) {
        data[fieldName] = {}
      }

      // Recursively store nested values
      storeData(fieldValue, data[fieldName])
      continue
    }

    // Store simple values (strings, numbers, etc.)
    data[fieldName] = fieldValue
  }
}

/**
 * Copy all properties from session data to response locals
 *
 * @param {Record<string, unknown>} sessionData
 * @param {Record<string, unknown>} localsData
 */
function copySessionToLocals(sessionData, localsData) {
  for (const [key, value] of Object.entries(sessionData)) {
    localsData[key] = value
  }
}

/**
 * Middleware - store any data sent in session, and pass it to all views
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function autoStoreData(req, res, next) {
  if (!isObject(req.session?.data)) {
    return next(new Error('Session middleware is not initialised'))
  }

  // Store data from POST body and GET query parameters
  // Query parameters are processed after body, so they take precedence
  storeData(req.body, req.session.data)
  storeData(req.query, req.session.data)

  // Initialise locals.data if it doesn't exist
  if (!isObject(res.locals.data)) {
    res.locals.data = {}
  }

  // Make session data available to all views via res.locals
  copySessionToLocals(req.session.data, res.locals.data)

  next()
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import { NestedValue, ObjectNested } from 'nhsuk-frontend'
 * @import { ParsedQs } from 'qs'
 */
