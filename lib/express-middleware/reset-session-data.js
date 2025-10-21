
const resetSessionData = function (req, res, next) {
  const { path, method } = req

  // Current page used for the Reset data feature
  res.locals.currentPage = req.originalUrl;

  if (method === 'GET' && path === '/prototype-admin/reset') {
    const returnPage = req.query.returnPage || '/';
    res.render('reset', {
      returnPage,
    });

  } else if (path === '/prototype-admin/reset-session-data') {

    const returnPage = (req.body.returnPage && req.body.returnPage.startsWith('/'))
  ? req.body.returnPage // Local paths only
  : '/';

    req.session.data = {};

    res.render('reset-done', {
      returnPage,
    });
  } else {
    next()
  }
}

module.exports = resetSessionData;
