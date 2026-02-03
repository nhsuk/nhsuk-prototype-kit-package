/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function resetSessionData(req, res, next) {
  let { returnPage } = req.body ?? req.query

  // Allow local paths only
  if (typeof returnPage !== 'string' || !returnPage.startsWith('/')) {
    returnPage = '/'
  }

  if (req.method === 'GET' && req.path === '/prototype-admin/reset') {
    return res.render('reset', {
      returnPage
    })
  }

  if (req.path === '/prototype-admin/reset-session-data') {
    return req.session.regenerate((error) => {
      if (error) {
        return next(error)
      }

      req.session.data = {}

      req.session.save((error) => {
        if (error) {
          return next(error)
        }

        res.render('reset-done', {
          returnPage
        })
      })
    })
  }

  next()
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
