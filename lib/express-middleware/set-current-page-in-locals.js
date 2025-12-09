/**
 * Set any useful local variables
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function setCurrentPageInLocals(req, res, next) {
  // Current page used for the Reset data feature
  res.locals.currentPage = req.originalUrl

  next()
}

export default setCurrentPageInLocals
