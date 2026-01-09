import express from 'express'

const router = express.Router()

router.get('/custom-route', (req, res) => {
  res.render('custom')
})

router.get('/test-flash', (req, res) => {
  req.flash('success', 'It worked.')
  res.redirect('/')
})

export default router
