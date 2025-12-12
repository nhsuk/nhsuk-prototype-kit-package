import express from 'express'

const router = express.Router()

router.get('/custom-route', (req, res) => {
  res.render('custom')
})

export default router
