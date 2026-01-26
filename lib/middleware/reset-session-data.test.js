import assert from 'node:assert'
import { describe, it, beforeEach, mock } from 'node:test'

import { resetSessionData } from './reset-session-data.js'

describe('resetSessionData middleware', () => {
  let /** @type {Request} */ req
  let /** @type {Response} */ res
  let /** @type {Mock<NextFunction>} */ next
  let /** @type {Mock<Response['render']>} */ render

  beforeEach(() => {
    req = /** @type {Request} */ ({
      path: '/',
      method: 'GET',
      originalUrl: '/test-page',
      query: {},
      body: {},
      session: {}
    })

    res = /** @type {Response} */ ({
      locals: {},
      render(_view, _options) {}
    })

    next = mock.fn()
    render = mock.method(res, 'render')
  })

  describe('GET /prototype-admin/reset', () => {
    beforeEach(() => {
      Object.assign(req, {
        method: 'GET',
        path: '/prototype-admin/reset'
      })
    })

    it('should render the reset view with returnPage from query', () => {
      req.query.returnPage = '/custom-page'
      resetSessionData(req, res, next)

      assert.deepStrictEqual(render.mock.calls[0].arguments, [
        'reset',
        { returnPage: '/custom-page' }
      ])
    })

    it('should use "/" as default returnPage when not provided', () => {
      resetSessionData(req, res, next)

      assert.deepStrictEqual(render.mock.calls[0].arguments, [
        'reset',
        { returnPage: '/' }
      ])
    })

    it('should not call next()', () => {
      resetSessionData(req, res, next)
      assert.strictEqual(next.mock.callCount(), 0)
    })
  })

  describe('POST /prototype-admin/reset-session-data', () => {
    beforeEach(() => {
      Object.assign(req, {
        method: 'POST',
        path: '/prototype-admin/reset-session-data'
      })
    })

    it('should reset session data and render reset-done view', () => {
      req.body.returnPage = '/dashboard'
      resetSessionData(req, res, next)

      assert.deepStrictEqual(req.session.data, {})

      assert.deepStrictEqual(render.mock.calls[0].arguments, [
        'reset-done',
        { returnPage: '/dashboard' }
      ])
    })

    it('should use "/" as default when returnPage not provided', () => {
      resetSessionData(req, res, next)

      assert.deepStrictEqual(req.session.data, {})

      assert.deepStrictEqual(render.mock.calls[0].arguments, [
        'reset-done',
        { returnPage: '/' }
      ])
    })

    it('should reject returnPage that does not start with "/"', () => {
      req.body.returnPage = 'https://malicious.com'
      resetSessionData(req, res, next)

      assert.deepStrictEqual(render.mock.calls[0].arguments, [
        'reset-done',
        { returnPage: '/' }
      ])
    })

    it('should reject returnPage without leading slash', () => {
      req.body.returnPage = 'relative-path'
      resetSessionData(req, res, next)

      assert.deepStrictEqual(render.mock.calls[0].arguments, [
        'reset-done',
        { returnPage: '/' }
      ])
    })

    it('should accept valid local path with query string', () => {
      req.body.returnPage = '/page?foo=bar'
      resetSessionData(req, res, next)

      assert.deepStrictEqual(render.mock.calls[0].arguments, [
        'reset-done',
        { returnPage: '/page?foo=bar' }
      ])
    })

    it('should clear existing session data', () => {
      req.session.data = { key1: 'value1', key2: 'value2' }
      resetSessionData(req, res, next)

      assert.deepStrictEqual(req.session.data, {})
    })

    it('should not call next()', () => {
      resetSessionData(req, res, next)
      assert.strictEqual(next.mock.callCount(), 0)
    })
  })

  describe('other routes', () => {
    it('should call next()', () => {
      Object.assign(req, {
        path: '/some-other-page'
      })

      resetSessionData(req, res, next)

      assert.strictEqual(next.mock.callCount(), 1)
    })

    it('should set res.locals.currentPage for all requests', () => {
      Object.assign(req, {
        originalUrl: '/test-url?param=value',
        path: '/some-page'
      })

      resetSessionData(req, res, next)

      assert.strictEqual(res.locals.currentPage, '/test-url?param=value')
    })
  })

  describe('reset-session-data endpoint behavior', () => {
    it('should reset session on GET request to reset-session-data path', () => {
      Object.assign(req, {
        method: 'GET',
        path: '/prototype-admin/reset-session-data',

        // Note: The middleware doesn't check method, so GET requests will also reset session
        // In practice, req.body would be empty for GET, so returnPage defaults to '/'
        session: {
          data: { key: 'value' }
        }
      })

      resetSessionData(req, res, next)

      assert.deepStrictEqual(req.session.data, {})

      assert.deepStrictEqual(render.mock.calls[0].arguments, [
        'reset-done',
        { returnPage: '/' }
      ])

      assert.strictEqual(next.mock.callCount(), 0)
    })
  })
})

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import { Mock } from 'node:test'
 */
