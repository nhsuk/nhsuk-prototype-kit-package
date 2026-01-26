/**
 * @param {Request} req
 * @param {Response} res
 */
export function renderPageNotFound(req, res) {
  const path = req.path

  res.status(404)
  res.render('404', {
    path
  })
}

/**
 * @import { Request, Response } from 'express'
 */
