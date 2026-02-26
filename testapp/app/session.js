import cookieSession from 'cookie-session'

import * as config from './config.js'

/**
 * Cookie session store
 */
function getCookieSession() {
  return cookieSession({
    name: config.sessionName,
    secret: config.sessionName,
    maxAge: config.sessionMaxAge
  })
}

export const session = getCookieSession()
