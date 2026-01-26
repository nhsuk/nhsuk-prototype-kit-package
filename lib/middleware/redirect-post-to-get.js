import * as url from 'node:url'

/**
 * This Express middleware function redirects all POST
 * requests to a GET request, to avoid 'Are you sure you
 * want to send a form again?' when refreshing the page.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function redirectPostToGet(req, res, next) {
  if (req.method === 'POST') {
    res.redirect(
      url.format({
        pathname: req.path,
        // @ts-expect-error - Type 'ParsedQs' is not assignable to type 'ParsedUrlQueryInput'
        query: req.query
      })
    )
  } else {
    next()
  }
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
