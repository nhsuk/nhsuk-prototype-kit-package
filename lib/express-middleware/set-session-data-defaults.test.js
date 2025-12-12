import assert from 'node:assert'
import { describe, it, beforeEach } from 'node:test'

import { setSessionDataDefaults } from './set-session-data-defaults.js'

describe('setSessionDataDefaults middleware', () => {
  let req, res, nextCalled

  beforeEach(() => {
    // Setup fresh request, response, and next function for each test
    req = {
      session: {}
    }
    res = {}
    nextCalled = false
  })

  const next = () => {
    nextCalled = true
  }

  it('should initialize req.session.data if it does not exist', () => {
    const middleware = setSessionDataDefaults({ defaults: {} })

    middleware(req, res, next)

    assert.ok(req.session.data, 'session.data should be initialized')
    assert.deepStrictEqual(req.session.data, {})
    assert.strictEqual(nextCalled, true, 'next() should be called')
  })

  it('should set default values when session.data is empty', () => {
    const defaults = {
      name: 'John Doe',
      age: 30
    }
    const middleware = setSessionDataDefaults({ defaults })

    middleware(req, res, next)

    assert.deepStrictEqual(req.session.data, defaults)
    assert.strictEqual(nextCalled, true)
  })

  it('should preserve existing session data over defaults', () => {
    req.session.data = {
      name: 'Jane Smith',
      email: 'jane@example.com'
    }

    const defaults = {
      name: 'John Doe',
      age: 30
    }
    const middleware = setSessionDataDefaults({ defaults })

    middleware(req, res, next)

    // Existing values should be preserved, defaults should be added
    assert.strictEqual(
      req.session.data.name,
      'Jane Smith',
      'existing name should be preserved'
    )
    assert.strictEqual(
      req.session.data.email,
      'jane@example.com',
      'existing email should be preserved'
    )
    assert.strictEqual(req.session.data.age, 30, 'default age should be added')
    assert.strictEqual(nextCalled, true)
  })
})
