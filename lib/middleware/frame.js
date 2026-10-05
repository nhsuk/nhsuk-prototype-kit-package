/**
 * Render the phone frame page at GET /frame?url=/path
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function frame(req, res, next) {
  if (req.path !== '/frame' || req.method !== 'GET') {
    return next()
  }

  const { url } = req.query

  // Only allow relative paths – reject external or protocol-relative URLs
  const iframeSrc = typeof url === 'string' && /^\/[^/]/.test(url) ? url : '/'

  res.render('frame', { iframeSrc })
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
