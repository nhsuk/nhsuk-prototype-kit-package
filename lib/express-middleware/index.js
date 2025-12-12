import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import session from 'express-session'

import authenticate from './authentication.js'
import { matchRoutes } from './auto-routing.js'
import autoStoreData from './auto-store-data.js'
import productionHeaders from './production-headers.js'
import redirectPostToGet from './redirect-post-to-get.js'
import renderErrorPage from './render-error-page.js'
import renderPageNotFound from './render-page-not-found.js'
import resetSessionData from './reset-session-data.js'
import setCurrentPageInLocals from './set-current-page-in-locals.js'
import setSessionDataDefaults from './set-session-data-defaults.js'

export {
  authenticate,
  matchRoutes,
  autoStoreData,
  productionHeaders,
  redirectPostToGet,
  renderErrorPage,
  renderPageNotFound,
  resetSessionData,
  setCurrentPageInLocals,
  setSessionDataDefaults
}

const SESSION_COOKIE_MAX_AGE = 1000 * 60 * 60 * 4 // 4 hours

/**
 * Generate a unique session name based on the service name
 *
 * @param {string} serviceName -
 */
function generateSessionName(serviceName) {
  const hash = new TextEncoder()
    .encode(serviceName)
    .reduce((hex, byte) => hex + byte.toString(16).padStart(2, '0'), '')

  return `nhsuk-prototype-kit-${hash}`
}

/**
 * Configure session middleware
 *
 */
function configureSession(app, serviceName) {
  const sessionName = generateSessionName(serviceName)

  app.use(
    session({
      secret: sessionName,
      name: sessionName,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: SESSION_COOKIE_MAX_AGE
      }
    })
  )
}

// The 'all' middleware uses everything, including
// some external middleware such as body-parser,
// cookie-parse and express-session.
//
// You can pass it some options including:
//
// * serviceName - this is added to locals
// * locals - a function to set additional locals
// * routes - additional custom routes
// * sessionDataDefaults - default data to set in the session
export function all(options) {
  return function (req, res, next) {
    const { app } = req
    const serviceName = options.serviceName || 'Service name goes here'

    // Configure core middleware
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({ extended: true }))

    // Configure session
    configureSession(app, serviceName)

    // Set locals
    app.use(setCurrentPageInLocals)
    res.locals.serviceName = serviceName

    // Add production-specific middleware
    if (process.env.NODE_ENV === 'production') {
      app.use(productionHeaders)
      app.use(authenticate)
    }

    // Use NHS Prototype Kit static assets
    app.use(
      '/nhsuk-prototype-kit-assets',
      express.static(new URL('assets', import.meta.url).pathname)
    )

    // Add reset session routes
    app.use(resetSessionData)

    // Set default session data
    if (options.sessionDataDefaults) {
      app.use(
        setSessionDataDefaults({
          defaults: options.sessionDataDefaults
        })
      )
    }

    // Set session data from GET or POST requests
    app.use(autoStoreData)

    // Set any other locals
    if (options.locals) {
      app.use(options.locals)
    }

    // Use custom routes
    if (options.routes) {
      app.use(options.routes)
    }

    app.use(redirectPostToGet)

    // Auto-routes – this must come after custom routes
    app.use(matchRoutes)

    // Page not found - this must come last
    app.use(renderPageNotFound, renderErrorPage)

    next()
  }
}
