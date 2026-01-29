/**
 * @param {StatusError} error
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} _next
 */
export function renderErrorPage(error, req, res, _next) {
  error.status ??= 500

  console.error(error.stack)

  if (res.statusCode !== 200) {
    error.status = res.statusCode
  }

  res.status(error.status)
  res.render('500.html', { error })
}

/**
 * @typedef {Error & { status?: number }} StatusError
 */

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
