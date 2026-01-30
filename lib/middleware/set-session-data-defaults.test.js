import assert from 'node:assert/strict'
import { describe, it, beforeEach, mock } from 'node:test'

import { setSessionDataDefaults } from './set-session-data-defaults.js'

describe('setSessionDataDefaults middleware', () => {
  let /** @type {Request} */ req
  let /** @type {Response} */ res
  let /** @type {Mock<NextFunction>} */ next

  beforeEach(() => {
    req = /** @type {Request} */ ({
      session: {}
    })

    res = /** @type {Response} */ ({
      locals: {}
    })

    next = mock.fn()
  })

  it('should initialize req.session.data if it does not exist', () => {
    const middleware = setSessionDataDefaults({ defaults: {} })

    middleware(req, res, next)

    assert.ok(req.session.data, 'session.data should be initialized')
    assert.deepEqual(req.session.data, {})
    assert.equal(next.mock.callCount(), 1)
  })

  it('should set default values when session.data is empty', () => {
    const defaults = {
      name: 'John Doe',
      age: 30
    }
    const middleware = setSessionDataDefaults({ defaults })

    middleware(req, res, next)

    assert.deepEqual(req.session.data, defaults)
    assert.equal(next.mock.callCount(), 1)
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
    assert.equal(
      req.session.data.name,
      'Jane Smith',
      'existing name should be preserved'
    )
    assert.equal(
      req.session.data.email,
      'jane@example.com',
      'existing email should be preserved'
    )
    assert.equal(req.session.data.age, 30, 'default age should be added')
    assert.equal(next.mock.callCount(), 1)
  })

  it('should throw TypeError when options.defaults is not provided', () => {
    assert.throws(
      () => {
        // @ts-expect-error - An argument for 'options' was not provided
        setSessionDataDefaults()
      },
      {
        name: 'TypeError',
        message: 'options.defaults must be an object'
      }
    )
  })

  it('should throw TypeError when options.defaults is not an object', () => {
    assert.throws(
      () => {
        // @ts-expect-error - Type 'string' is not assignable
        setSessionDataDefaults({ defaults: 'not an object' })
      },
      {
        name: 'TypeError',
        message: 'options.defaults must be an object'
      }
    )
  })

  it('should throw TypeError when options.defaults is null', () => {
    assert.throws(
      () => {
        setSessionDataDefaults({ defaults: null })
      },
      {
        name: 'TypeError',
        message: 'options.defaults must be an object'
      }
    )
  })

  it('should call next with error when req.session does not exist', () => {
    delete req.session

    const middleware = setSessionDataDefaults({ defaults: {} })

    middleware(req, res, next)

    assert.deepEqual(
      next.mock.calls[0].arguments[0],
      new Error(
        'Session middleware must be initialized before setSessionDataDefaults'
      )
    )
  })
})

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import { Mock } from 'node:test'
 */
