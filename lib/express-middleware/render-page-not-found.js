const renderPageNotFound = function (req, res) {
  const path = req.path

  res.status(404)
  res.render('404', {
    path
  })
}

export default renderPageNotFound
