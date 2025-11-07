const express = require('express')

const router = express.Router()

router.get('/custom-route', (req, res) => {
  res.render('custom')
})

module.exports = router
