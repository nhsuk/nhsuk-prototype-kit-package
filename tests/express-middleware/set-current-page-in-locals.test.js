const assert = require('node:assert')
const { describe, it } = require('node:test')

const setCurrentPageInLocals = require('../../lib/express-middleware/set-current-page-in-locals')

describe('setCurrentPageInLocals middleware', () => {
  let req, res, nextCalled

  req = {}

  res = {
    locals: {}
  }

  const next = () => {
    nextCalled = true
  }

  it('should set the orginalUrl as currentPage in locals', () => {
    req.originalUrl = '/contact'
    setCurrentPageInLocals(req, res, next)

    assert.strictEqual(res.locals.currentPage, '/contact')
  })

  it('should call next(', () => {
    req.originalUrl = '/contact'
    setCurrentPageInLocals(req, res, next)

    assert.strictEqual(nextCalled, true)
  })
})
