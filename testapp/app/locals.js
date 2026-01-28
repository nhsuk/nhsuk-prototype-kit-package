/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function locals(req, res, next) {
  res.locals.organisationName = req.session.data?.organisationName
  next()
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
