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
function redirectPostToGet(req, res, next) {
  if (req.method === 'POST') {
    res.redirect(
      url.format({
        pathname: req.path,
        query: req.query
      })
    )
  } else {
    next()
  }
}

export default redirectPostToGet
