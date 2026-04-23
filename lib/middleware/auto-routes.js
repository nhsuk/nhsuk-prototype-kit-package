/**
 * Normalize the request path for template rendering
 *
 * Removes the leading slash and defaults to 'index' for the root path
 *
 * @param {string} requestPath - The original request path from Express
 * @returns {string} The normalized path ready for template rendering
 */
function normalizeTemplatePath(requestPath) {
  const templatePath = requestPath
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/$/, '') // Remove trailing slash

  // Default to 'index' for root path
  return templatePath || 'index'
}

/**
 * Express middleware to automatically route requests to template files
 *
 * Tries to match a request to a template. For example, a request for /test
 * will look for test.html, and if not found, test/index.html
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function autoRoutes(req, res, next) {
  const templatePath = normalizeTemplatePath(req.path)

  res.render(templatePath, undefined, (error, html) => {
    if (error) {
      const isNotFound = error?.message?.startsWith('template not found')
      return next(isNotFound ? null : error)
    }

    // Template rendered successfully
    res.set('Content-Type', 'text/html; charset=utf-8')
    res.end(html)
  })
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
