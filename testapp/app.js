const express = require('express')
const NHSPrototypeKit = require('nhsuk-prototype-kit')
const path = require('path')
const nunjucks = require('nunjucks')
const { join } = require('node:path')

const routes = require('./routes')
const sessionDataDefaults = require('./data/session-data-defaults')
const locals = require('./locals')

const app = express()
const port = 3000

// Nunjucks configuration for application
const appViews = [
  join(__dirname, 'views/'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk/components'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk/macros'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist')
]

let nunjucksAppEnv = nunjucks.configure(appViews, {
  express: app,
  noCache: true
})

app.use('/', express.static(path.join(__dirname, 'static')))

// Use assets from NHS frontend
app.use(
  '/nhsuk-frontend',
  express.static(join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk'))
)

NHSPrototypeKit.init({
  serviceName: 'Test service',
  express: app,
  nunjucks: nunjucksAppEnv,
  routes: routes,
  locals: locals,
  sessionDataDefaults: sessionDataDefaults
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
