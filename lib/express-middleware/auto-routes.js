/**
 * Constants for template rendering
 */
const TEMPLATE_NOT_FOUND_ERROR_PREFIX = 'template not found'
const HTML_CONTENT_TYPE = 'text/html; charset=utf-8'

/**
 * Check if an error is a "template not found" error from the rendering engine
 *
 * @param {Error} error - The error object from the template renderer
 * @returns {boolean} True if the error indicates template was not found
 */
function isTemplateNotFoundError(error) {
  return error?.message?.startsWith(TEMPLATE_NOT_FOUND_ERROR_PREFIX) ?? false
}

/**
 * Send the rendered HTML to the client with appropriate headers
 *
 * @param {Response} res - Express response object
 * @param {string} html - The rendered HTML content
 */
function sendHtmlResponse(res, html) {
  res.set({ 'Content-type': HTML_CONTENT_TYPE })
  res.end(html)
}

/**
 * Attempt to render a template at the given path
 *
 * This function tries to render the template and handles three scenarios:
 * 1. Success: sends the rendered HTML to the client
 * 2. Template not found: tries to render [path]/index.html (for directory-style URLs)
 * 3. Other errors: passes the error to the next middleware
 *
 * @param {string} templatePath - Path to the template to render
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
function attemptRender(templatePath, res, next) {
  res.render(templatePath, (error, html) => {
    if (!error) {
      // Template rendered successfully
      sendHtmlResponse(res, html)
      return
    }

    if (!isTemplateNotFoundError(error)) {
      // Not a "template not found" error - pass to next error handler
      next(error)
      return
    }

    // Try appending /index if we haven't already
    if (!templatePath.endsWith('/index')) {
      attemptRender(`${templatePath}/index`, res, next)
      return
    }

    // Neither the direct path nor the /index path exists - call next()
    next()
  })
}

/**
 * Normalize the request path for template rendering
 *
 * Removes the leading slash and defaults to 'index' for the root path
 *
 * @param {string} requestPath - The original request path from Express
 * @returns {string} The normalized path ready for template rendering
 */
function normalizeTemplatePath(requestPath) {
  // Remove leading slash (template renderer doesn't work with it)
  const pathWithoutLeadingSlash = requestPath.substring(1)

  // Default to 'index' for root path
  return pathWithoutLeadingSlash === '' ? 'index' : pathWithoutLeadingSlash
}

/**
 * Express middleware to automatically route requests to template files
 *
 * Tries to match a request to a template. For example, a request for /test
 * will look for test.html, and if not found, test/index.html
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export function autoRoutes(req, res, next) {
  const templatePath = normalizeTemplatePath(req.path)
  attemptRender(templatePath, res, next)
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
