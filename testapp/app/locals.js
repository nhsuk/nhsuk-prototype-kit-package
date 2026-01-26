/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function setLocals(req, res, next) {
  res.locals.organisationName = req.session.data?.organisationName
  next()
}

export default setLocals

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
