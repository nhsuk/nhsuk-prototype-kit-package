/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function resetSessionData(req, res, next) {
  const { path, method } = req

  if (method === 'GET' && path === '/prototype-admin/reset') {
    const returnPage = req.query.returnPage || '/'
    res.render('reset', {
      returnPage
    })
  } else if (path === '/prototype-admin/reset-session-data') {
    const returnPage =
      req.body.returnPage && req.body.returnPage.startsWith('/')
        ? req.body.returnPage // Local paths only
        : '/'

    req.session.data = {}

    res.render('reset-done', {
      returnPage
    })
  } else {
    next()
  }
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
