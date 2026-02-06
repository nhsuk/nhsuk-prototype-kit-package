import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import flash from 'express-flash'
import session from 'express-session'

import { getSessionName } from '../utils/index.js'

import { authentication } from './authentication.js'
import { autoRoutes } from './auto-routes.js'
import { autoStoreData } from './auto-store-data.js'
import { productionHeaders } from './production-headers.js'
import { redirectPostToGet } from './redirect-post-to-get.js'
import { renderErrorPage } from './render-error-page.js'
import { renderPageNotFound } from './render-page-not-found.js'
import { resetSessionData } from './reset-session-data.js'
import { setCurrentPageInLocals } from './set-current-page-in-locals.js'
import { setSessionDataDefaults } from './set-session-data-defaults.js'

export {
  authentication,
  autoRoutes,
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
 * Configure session middleware
 *
 * @param {Pick<Options, 'app' | 'serviceName' | 'session'>} options
 */
export function configureSession(options) {
  const { app, serviceName } = options
  const sessionName = getSessionName(serviceName)

  app.use(
    options.session ??
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

/**
 * Configure all the middleware, including
 * some external middleware such as body-parser,
 * cookie-parser and express-session.
 *
 * @param {Options} options
 */
export function configure(options) {
  const { app, serviceName } = options

  // Configure core middleware
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Configure session
  configureSession(options)

  // Use flash
  app.use(flash())

  // Set locals
  app.use(setCurrentPageInLocals)
  app.use((req, res, next) => {
    res.locals.serviceName = serviceName
    next()
  })

  // Add production-specific middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(productionHeaders)
    app.use(authentication)
  }

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
  app.use(autoRoutes)

  // Page not found - this must come last
  app.use(renderPageNotFound, renderErrorPage)
}

/**
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
