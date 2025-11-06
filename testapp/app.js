const express = require('express')
const NHSPrototypeKit = require('nhsuk-prototype-kit')
const app = express()
const path = require('path')
const nunjucks = require('nunjucks')
const session = require('express-session')

const { join } = require('node:path')

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

// Use session
app.use(
  session({
    secret: 'nhsuk-prototype-kit',
    resave: false,
    saveUninitialized: true
  })
)

app.use('/', express.static(path.join(__dirname, 'static')))

NHSPrototypeKit.init(app, nunjucksAppEnv)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
