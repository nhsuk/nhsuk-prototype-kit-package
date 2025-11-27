const { join } = require('node:path')
const path = require('node:path')

const express = require('express')
const NHSPrototypeKit = require('nhsuk-prototype-kit')
const nunjucks = require('nunjucks')

const sessionDataDefaults = require('./data/session-data-defaults')
const locals = require('./locals')
const routes = require('./routes')

const app = express()
let port = 3000

// Nunjucks configuration for application
const appViews = [
  join(__dirname, 'views/'),
  join(__dirname, '../node_modules/nhsuk-frontend/dist/nhsuk/components'),
  join(__dirname, '../node_modules/nhsuk-frontend/dist/nhsuk/macros'),
  join(__dirname, '../node_modules/nhsuk-frontend/dist/nhsuk'),
  join(__dirname, '../node_modules/nhsuk-frontend/dist')
]

const nunjucksAppEnv = nunjucks.configure(appViews, {
  express: app,
  noCache: true
})

// Use our own compiled assets
app.use('/', express.static(path.join(__dirname, 'public')))

// Use assets from NHS frontend
app.use(
  '/nhsuk-frontend',
  express.static(join(__dirname, '../node_modules/nhsuk-frontend/dist/nhsuk'))
)

// Use assets from NHS Prototype Kit
app.use(
  '/nhsuk-prototype-kit-assets',
  express.static(join(__dirname, '../lib/assets'))
)

const prototype = NHSPrototypeKit.init({
  serviceName: 'Test service',
  express: app,
  nunjucks: nunjucksAppEnv,
  esbuild: {
    entryPoints: ['assets/sass/*.scss', 'assets/javascript/*.js'],
    sassLoadPaths: ['../node_modules']
  },
  routes,
  locals,
  sessionDataDefaults
})

prototype.start(port)
