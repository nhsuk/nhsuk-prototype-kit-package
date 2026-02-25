import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import express from 'express'

export const routes = express.Router()

const govukFrontendPath = fileURLToPath(
  dirname(import.meta.resolve('govuk-frontend/package.json'))
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
