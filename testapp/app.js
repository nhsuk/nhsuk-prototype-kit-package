import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import express from 'express'
import NHSPrototypeKit from 'nhsuk-prototype-kit'
import nunjucks from 'nunjucks'

import sessionDataDefaults from './data/session-data-defaults.js'
import locals from './locals.js'
import routes from './routes.js'

const app = express()
let port = 3000

// NHS.UK frontend package path
const frontendPath = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-frontend/package.json'))
)

// Nunjucks configuration for application
const appViews = [
  join(import.meta.dirname, 'views'),
  join(frontendPath, 'dist/nhsuk/components'),
  join(frontendPath, 'dist/nhsuk/macros'),
  join(frontendPath, 'dist/nhsuk'),
  join(frontendPath, 'dist')
]

const nunjucksAppEnv = nunjucks.configure(appViews, {
  express: app,
  noCache: true
})

const prototype = NHSPrototypeKit.init({
  serviceName: 'Test service',
  express: app,
  nunjucks: nunjucksAppEnv,
  buildOptions: {
    entryPoints: ['assets/sass/*.scss', 'assets/javascript/*.js'],
    sassLoadPaths: ['../node_modules']
  },
  routes,
  locals,
  sessionDataDefaults
})

prototype.start(port)
