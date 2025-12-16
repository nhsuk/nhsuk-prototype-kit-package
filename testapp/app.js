import { join } from 'node:path'

import express from 'express'
import NHSPrototypeKit from 'nhsuk-prototype-kit'
import nunjucks from 'nunjucks'

import sessionDataDefaults from './data/session-data-defaults.js'
import locals from './locals.js'
import routes from './routes.js'

const app = express()
let port = 3000

// Nunjucks configuration for application
const appViews = [
  join(import.meta.dirname, 'views/'),
  join(
    import.meta.dirname,
    '../node_modules/nhsuk-frontend/dist/nhsuk/components'
  ),
  join(import.meta.dirname, '../node_modules/nhsuk-frontend/dist/nhsuk/macros'),
  join(import.meta.dirname, '../node_modules/nhsuk-frontend/dist/nhsuk'),
  join(import.meta.dirname, '../node_modules/nhsuk-frontend/dist')
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
