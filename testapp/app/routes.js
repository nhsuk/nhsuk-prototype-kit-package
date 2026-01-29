import express from 'express'

export const routes = express.Router()

routes.get('/custom-route', (req, res) => {
  res.render('custom')
})

routes.get('/test-flash', (req, res) => {
  req.flash('success', 'It worked.')
  res.redirect('/')
})
