const renderErrorPage = function (error, req, res, _next) {
  error.status = error.status || 500

  console.error(error.stack)

  res.status(error.status)
  res.render('500.html', { error })
}

module.exports = renderErrorPage
