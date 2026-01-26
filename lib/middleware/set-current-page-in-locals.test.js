import assert from 'node:assert'
import { describe, it, beforeEach, mock } from 'node:test'

import { setCurrentPageInLocals } from './set-current-page-in-locals.js'

describe('setCurrentPageInLocals middleware', () => {
  let /** @type {Request} */ req
  let /** @type {Response} */ res
  let /** @type {Mock<NextFunction>} */ next

  beforeEach(() => {
    req = /** @type {Request} */ ({})
    res = /** @type {Response} */ ({
      locals: {}
    })

    next = mock.fn()
  })

  it('should set the original path including querystring in locals', () => {
    Object.assign(req, {
      originalUrl: '/this/is/a/test?query=string',
      path: '/this/is/a/test'
    })

    setCurrentPageInLocals(req, res, next)

    assert.deepStrictEqual(
      res.locals.currentPage,
      '/this/is/a/test?query=string'
    )
  })

  it('should call next()', () => {
    setCurrentPageInLocals(req, res, next)

    assert.strictEqual(next.mock.callCount(), 1)
  })
})

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import { Mock } from 'node:test'
 */
