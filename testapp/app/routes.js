import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import express from 'express'

export const routes = express.Router()

const govukPrototypeComponentsPath = resolve(
  fileURLToPath(import.meta.resolve('@x-govuk/govuk-prototype-components')),
  '../../..'
)

const govukFrontendPath = fileURLToPath(
  dirname(import.meta.resolve('govuk-frontend/package.json'))
)

routes.use(
  '/@x-govuk/govuk-prototype-components',
  express.static(join(govukPrototypeComponentsPath, 'dist'))
)

routes.use(
  '/govuk-frontend',
  express.static(join(govukFrontendPath, 'dist/govuk'))
)

routes.get('/custom-route', (req, res) => {
  res.render('custom')
})

routes.get('/test-flash', (req, res) => {
  req.flash('success', 'It worked.')
  res.redirect('/')
})
