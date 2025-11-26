const assert = require('node:assert')
const { describe, it, beforeEach } = require('node:test')

const resetSessionData = require('./reset-session-data')

describe('resetSessionData middleware', () => {
  let req, res, nextCalled

  beforeEach(() => {
    req = {
      path: '/',
      method: 'GET',
      originalUrl: '/test-page',
      query: {},
      body: {},
      session: { data: { existingKey: 'value' } }
    }
    nextCalled = false

    res = {
      locals: {},
      render: function (view, data) {
        this.renderedView = view
        this.renderedData = data
      }
    }
  })

  const next = () => {
    nextCalled = true
  }

  describe('GET /prototype-admin/reset', () => {
    beforeEach(() => {
      req.method = 'GET'
      req.path = '/prototype-admin/reset'
    })

    it('should render the reset view with returnPage from query', () => {
      req.query.returnPage = '/custom-page'
      resetSessionData(req, res, next)

      assert.strictEqual(res.renderedView, 'reset')
      assert.strictEqual(res.renderedData.returnPage, '/custom-page')
    })

    it('should use "/" as default returnPage when not provided', () => {
      resetSessionData(req, res, next)

      assert.strictEqual(res.renderedView, 'reset')
      assert.strictEqual(res.renderedData.returnPage, '/')
    })

    it('should not call next()', () => {
      resetSessionData(req, res, next)
      assert.strictEqual(nextCalled, false)
    })
  })

  describe('POST /prototype-admin/reset-session-data', () => {
    beforeEach(() => {
      req.method = 'POST'
      req.path = '/prototype-admin/reset-session-data'
    })

    it('should reset session data and render reset-done view', () => {
      req.body.returnPage = '/dashboard'
      resetSessionData(req, res, next)

      assert.deepStrictEqual(req.session.data, {})
      assert.strictEqual(res.renderedView, 'reset-done')
      assert.strictEqual(res.renderedData.returnPage, '/dashboard')
    })

    it('should use "/" as default when returnPage not provided', () => {
      resetSessionData(req, res, next)

      assert.deepStrictEqual(req.session.data, {})
      assert.strictEqual(res.renderedView, 'reset-done')
      assert.strictEqual(res.renderedData.returnPage, '/')
    })

    it('should reject returnPage that does not start with "/"', () => {
      req.body.returnPage = 'https://malicious.com'
      resetSessionData(req, res, next)

      assert.strictEqual(res.renderedData.returnPage, '/')
    })

    it('should reject returnPage without leading slash', () => {
      req.body.returnPage = 'relative-path'
      resetSessionData(req, res, next)

      assert.strictEqual(res.renderedData.returnPage, '/')
    })

    it('should accept valid local path with query string', () => {
      req.body.returnPage = '/page?foo=bar'
      resetSessionData(req, res, next)

      assert.strictEqual(res.renderedData.returnPage, '/page?foo=bar')
    })

    it('should clear existing session data', () => {
      req.session.data = { key1: 'value1', key2: 'value2' }
      resetSessionData(req, res, next)

      assert.deepStrictEqual(req.session.data, {})
    })

    it('should not call next()', () => {
      resetSessionData(req, res, next)
      assert.strictEqual(nextCalled, false)
    })
  })

  describe('other routes', () => {
    it('should call next()', () => {
      req.path = '/some-other-page'
      resetSessionData(req, res, next)

      assert.strictEqual(nextCalled, true)
    })
  })
})
