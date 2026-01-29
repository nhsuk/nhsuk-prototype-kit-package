import { createHash } from 'node:crypto'
import { format as urlFormat } from 'node:url'

/**
 * @param {string} password
 */
const encryptPassword = function (password) {
  if (typeof password !== 'string' || !password) {
    return undefined
  }
  const hash = createHash('sha256')
  hash.update(password)
  return hash.digest('hex')
}

const allowedPathsWhenUnauthenticated = [
  '/prototype-admin/password',
  '/nhsuk-frontend/nhsuk-frontend.min.css',
  '/nhsuk-frontend/nhsuk-frontend.min.css.map',
  '/nhsuk-frontend/nhsuk-frontend.min.js',
  '/nhsuk-frontend/nhsuk-frontend.min.js.map'
]

/**
 * Redirect the user to the password page, with
 * the current page path set as the returnURL in a query
 * string so the user can be redirected back after successfully
 * entering a password
 *
 * @param {Request} req
 * @param {Response} res
 */
function sendUserToPasswordPage(req, res) {
  const returnURL = urlFormat({
    pathname: req.path,
    // @ts-expect-error - Type 'ParsedQs' is not assignable to type 'ParsedUrlQueryInput'
    query: req.query
  })
  const passwordPageURL = urlFormat({
    pathname: '/prototype-admin/password',
    query: { returnURL }
  })
  res.redirect(passwordPageURL)
}

/**
 * Give the user some instructions on how to set a password
 *
 * @param {Response} res
 */
function showNoPasswordError(res) {
  return res.send(
    '<h1>Error:</h1><p>Password not set. <a href="https://prototype-kit.service-manual.nhs.uk/how-tos/publish-your-prototype-online">See guidance for setting a password</a>.</p>'
  )
}

let encryptedPassword

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function authentication(req, res, next) {
  const password = process.env.PROTOTYPE_PASSWORD

  if (!password) {
    showNoPasswordError(res)
    return
  }

  encryptedPassword = encryptPassword(password)

  if (req.path === '/prototype-admin/password' && req.method === 'GET') {
    const returnURL = req.query.returnURL || '/'
    const { error } = req.query
    res.render('password', {
      returnURL,
      error
    })
  } else if (
    req.path === '/prototype-admin/password' &&
    req.method === 'POST'
  ) {
    const submittedPassword = req.body.password
    const returnURL = req.body.returnURL || '/'

    if (submittedPassword === password) {
      const encryptedPassword = encryptPassword(submittedPassword)

      if (encryptedPassword) {
        res.cookie('authentication', encryptedPassword, {
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
          sameSite: 'none', // Allows GET and POST requests from other domains
          httpOnly: true,
          secure: true
        })
      }

      res.redirect(returnURL)
    } else {
      res.redirect(
        `/prototype-admin/password?error=wrong-password&returnURL=${encodeURIComponent(returnURL)}`
      )
    }
  } else if (
    req.path.startsWith('/nhsuk-frontend/assets/') ||
    allowedPathsWhenUnauthenticated.includes(req.path)
  ) {
    next()
  } else if (req.cookies.authentication === encryptedPassword) {
    next()
  } else {
    sendUserToPasswordPage(req, res)
  }
}

/**
 * @import { NextFunction, Request, Response } from 'express'
 */
