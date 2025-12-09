import assert from 'node:assert'
import { describe, it, beforeEach } from 'node:test'

import setCurrentPageInLocals from './set-current-page-in-locals.js'

describe('setCurrentPageInLocals middleware', () => {
  let req, res, nextCalled

  beforeEach(() => {
    nextCalled = false
    res = {
      locals: {}
    }
  })

  const next = () => {
    nextCalled = true
  }

  it('should set the original path including querystring in locals', () => {
    req = {
      originalUrl: '/this/is/a/test?query=string',
      path: '/this/is/a/test'
    }

    setCurrentPageInLocals(req, res, next)

    assert.deepStrictEqual(
      res.locals.currentPage,
      '/this/is/a/test?query=string'
    )
  })

  it('should call next()', () => {
    setCurrentPageInLocals(req, res, next)

    assert.strictEqual(nextCalled, true)
  })
})
