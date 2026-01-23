function setLocals(req, res, next) {
  res.locals.organisationName = req.session.data.organisationName
  next()
}

export default setLocals
