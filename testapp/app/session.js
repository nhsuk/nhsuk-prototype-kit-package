import connectPgSimple from 'connect-pg-simple'
import cookieSession from 'cookie-session'
import expressSession from 'express-session'
import { Pool } from 'pg'

import * as config from './config.js'

const { POSTGRES_URL, NODE_ENV } = process.env

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

/**
 * PostgreSQL session store
 */
function getDatabaseSession() {
  const PGStore = connectPgSimple(expressSession)

  const pool = new Pool({
    connectionString: POSTGRES_URL,
    ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  const store = new PGStore({
    createTableIfMissing: true,
    pool: pool
  })

  return expressSession({
    cookie: {
      maxAge: config.sessionMaxAge,
      secure: NODE_ENV === 'production'
    },
    resave: false,
    saveUninitialized: false,
    secret: config.sessionName,
    store
  })
}

export const session = POSTGRES_URL ? getDatabaseSession() : getCookieSession()
