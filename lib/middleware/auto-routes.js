import { stat } from 'node:fs/promises'
import { extname, isAbsolute, relative, resolve, sep } from 'node:path'

/**
 * Constants for template rendering
 */
const TEMPLATE_NOT_FOUND_ERROR_PREFIX = 'template not found'
const TEMPLATE_EXTENSIONS = ['.html', '.njk']
const HTML_CONTENT_TYPE = 'text/html; charset=utf-8'

/**
 * Check if an error is a "template not found" error from the rendering engine
 *
 * @param {Error | null} error - The error object from the template renderer
 * @returns {boolean} True if the error indicates template was not found
 */
export function isTemplateNotFoundError(error) {
  return error?.message?.startsWith(TEMPLATE_NOT_FOUND_ERROR_PREFIX) ?? false
}

/**
 * Send the rendered HTML to the client with appropriate headers
 *
 * @param {Response} res - Express response object
 * @param {string} html - The rendered HTML content
 */
function sendHtmlResponse(res, html) {
  res.set('Content-Type', HTML_CONTENT_TYPE)
  res.end(html)
}

/**
 * Attempt to render a template at the given path
 *
 * @param {string} templatePath - Path to the template to render
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
function attemptRender(templatePath, res, next) {
  res.render(templatePath, undefined, (error, html) => {
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

    // Template could not be found by the rendering engine - call next()
    next()
  })
}

/**
 * Get template names to try for a given path, in order of preference
 *
 * For example, `test` will try `test.html`, `test.njk`,
 * `test/index.html` and then `test/index.njk`
 *
 * @param {string} templatePath - The normalized template path
 * @returns {string[]} Template names to try
 */
export function getTemplateCandidates(templatePath) {
  const ext = extname(templatePath)

  if (ext && !TEMPLATE_EXTENSIONS.includes(ext)) {
    return [templatePath]
  }

  const base = ext ? templatePath.slice(0, -ext.length) : templatePath

  return [
    ...(ext !== '.njk' ? [`${base}.html`] : []),
    `${base}.njk`,
    `${base}/index.html`,
    `${base}/index.njk`
  ]
}

/**
 * Check whether a file exists
 *
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>} True if the path is a file
 */
async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile()
  } catch {
    return false
  }
}

/**
 * Find the template file within the app views paths only
 *
 * Templates elsewhere in the Nunjucks search paths (layouts, macros,
 * components etc) must not be auto-routed
 *
 * @param {string} templatePath - The normalized template path
 * @param {string | string[]} viewsPaths - App views path(s)
 * @returns {Promise<string | undefined>} Absolute path to the template
 */
export async function findTemplate(templatePath, viewsPaths) {
  const viewsDirs = [viewsPaths ?? []].flat().map((dir) => resolve(dir))

  for (const name of getTemplateCandidates(templatePath)) {
    for (const viewsDir of viewsDirs) {
      const filePath = resolve(viewsDir, name)
      const relativePath = relative(viewsDir, filePath)

      // Prevent paths outside the views directory
      if (
        relativePath === '..' ||
        relativePath.startsWith(`..${sep}`) ||
        isAbsolute(relativePath)
      ) {
        continue
      }

      if (await isFile(filePath)) {
        return filePath
      }
    }
  }
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
  const templatePath = requestPath
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/$/, '') // Remove trailing slash

  // Default to 'index' for root path
  return templatePath || 'index'
}

/**
 * Express middleware to automatically route requests to template files
 *
 * Tries to match a request to a template within the app views path(s).
 * For example, a request for /test will look for test.html, test.njk,
 * test/index.html and then test/index.njk
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function autoRoutes(req, res, next) {
  const templatePath = normalizeTemplatePath(req.path)

  let filePath
  try {
    filePath = await findTemplate(templatePath, req.app.get('views'))
  } catch (error) {
    next(error)
    return
  }

  if (!filePath) {
    next()
    return
  }

  attemptRender(filePath, res, next)
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
