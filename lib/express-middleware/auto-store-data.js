// Constants for special field values and prefixes
const UNCHECKED_VALUE = '_unchecked'
const IGNORED_PREFIX = '_'

/**
 * Check if a field name should be ignored (starts with underscore)
 *
 * @param {string} fieldName
 * @returns {boolean}
 */
function shouldIgnoreField(fieldName) {
  return fieldName.startsWith(IGNORED_PREFIX)
}

/**
 * Remove unchecked markers from an array of values
 *
 * @param {unknown[]} array
 * @returns {unknown[]}
 */
function removeUncheckedFromArray(array) {
  return array.filter((item) => item !== UNCHECKED_VALUE)
}

/**
 * Store data from POST body or GET query in session
 *
 * @param {{ [key: string]: unknown }} input
 * @param {unknown} data
 */
function storeData(input, data) {
  for (const fieldName in input) {
    // Skip fields that start with underscore (e.g., _csrf)
    if (shouldIgnoreField(fieldName)) {
      continue
    }

    const fieldValue = input[fieldName]

    // Handle unchecked checkboxes - delete the field from session
    if (fieldValue === UNCHECKED_VALUE) {
      Reflect.deleteProperty(data, fieldName)
      continue
    }

    // Handle arrays - remove any unchecked markers
    if (Array.isArray(fieldValue)) {
      data[fieldName] = removeUncheckedFromArray(fieldValue)
      continue
    }

    // Handle nested objects - merge recursively
    if (typeof fieldValue === 'object') {
      // Initialize as object if it doesn't exist or isn't an object
      if (typeof data[fieldName] !== 'object') {
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
  for (const key in sessionData) {
    localsData[key] = sessionData[key]
  }
}

/**
 * Middleware - store any data sent in session, and pass it to all views
 *
 * @param {Request['body']} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function autoStoreData(req, res, next) {
  // Initialize session data store if it doesn't exist
  if (!req.session.data) {
    req.session.data = {}
  }

  // Store data from POST body and GET query parameters
  // Query parameters are processed after body, so they take precedence
  storeData(req.body, req.session.data)
  storeData(req.query, req.session.data)

  // Make session data available to all views via res.locals
  res.locals.data = {}
  copySessionToLocals(req.session.data, res.locals.data)

  next()
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import { Environment } from 'nunjucks'
 */
