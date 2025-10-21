const express = require('express')
const NHSPrototypeKit = require('nhsuk-prototype-kit')
const app = express()
const path = require('path');
const nunjucks = require('nunjucks');
const session = require('express-session')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { join } = require('node:path')

const port = 3000

// Nunjucks configuration for application
const appViews = [
  join(__dirname, 'views/'),
  join(__dirname, 'node_modules/nhsuk-prototype-kit/lib/views/'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk/components'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk/macros'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist')
]

const nunjucksConfig = {
  autoescape: true,
  noCache: true,
};

nunjucksConfig.express = app;

let nunjucksAppEnv = nunjucks.configure(appViews, nunjucksConfig);

NHSPrototypeKit.nunjucksFilters.addAll(nunjucksAppEnv)

// Use session
app.use(session({
  secret: 'nhsuk-prototype-kit',
  resave: false,
  saveUninitialized: true
}))

// Use cookie middleware to parse cookies
app.use(cookieParser());

app.set('view engine', 'html');

app.use('/', express.static(path.join(__dirname, 'static')))

app.use(NHSPrototypeKit)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
