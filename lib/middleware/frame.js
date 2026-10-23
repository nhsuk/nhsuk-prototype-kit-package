// Placeholder origin, only used to resolve and compare relative URLs
const BASE_URL = 'http://localhost'

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

  res.render('frame', { iframeSrc: getIframeSrc(req.query.url) })
}

/**
 * Only allow same-origin paths (a prefix check isn't enough, as
 * browsers treat `\` as `/` and strip tabs and newlines)
 *
 * @param {unknown} url
 */
function getIframeSrc(url) {
  if (typeof url !== 'string' || !url.startsWith('/')) return '/'
  if (!URL.canParse(url, BASE_URL)) return '/'

  const { origin, pathname, search, hash } = new URL(url, BASE_URL)
  return origin === BASE_URL ? pathname + search + hash : '/'
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
