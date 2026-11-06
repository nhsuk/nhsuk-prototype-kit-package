import assert from 'node:assert/strict'
import { beforeEach, describe, it, mock } from 'node:test'

import { setSessionData } from './set-session-data-defaults.js'

describe('setSessionData middleware', () => {
  let /** @type {Request} */ req
  let /** @type {Response} */ res
  let /** @type {Mock<NextFunction>} */ next
  let /** @type {ObjectNested} */ defaults

  beforeEach(() => {
    req = /** @type {Request} */ ({
      session: {}
    })

    res = /** @type {Response} */ ({
      locals: {}
    })

    next = mock.fn()

    defaults = {
      name: 'John Doe',
      age: 30,
      contact: {
        email: 'john@example.com'
      },
      items: ['one', 'two']
    }
  })

  it('should initialise req.session.data if it does not exist', () => {
    delete req.session.data

    const middleware = setSessionData({})

    middleware(req, res, next)

    assert.deepEqual(req.session.data, {}, 'session.data should be initialised')
    assert.equal(next.mock.callCount(), 1)
  })

  it('should set default values when session.data is empty', () => {
    req.session.data = {}

    const middleware = setSessionData(defaults)

    middleware(req, res, next)

    assert.deepEqual(
      req.session.data,
      defaults,
      'session.data should be initialised'
    )

    assert.equal(next.mock.callCount(), 1)
  })

  it('should preserve existing session data over defaults', () => {
    const existing = {
      name: 'Jane Smith',
      contact: {
        email: 'jane@example.com'
      }
    }

    const updated = structuredClone({
      name: 'Jane Smith',
      age: defaults.age,
      contact: {
        email: 'jane@example.com'
      },
      items: defaults.items
    })

    req.session.data = structuredClone(existing)

    const middleware = setSessionData(defaults)

    middleware(req, res, next)

    assert.deepEqual(req.session.data, updated)
    assert.equal(next.mock.callCount(), 1)
  })

  describe('error handling', () => {
    it('should not throw without defaults', () => {
      assert.doesNotThrow(() => setSessionData())
      assert.doesNotThrow(() => setSessionData(null))
      assert.doesNotThrow(() => setSessionData(undefined))

      // @ts-expect-error - Type 'boolean' is not assignable
      assert.doesNotThrow(() => setSessionData(false))
    })

    it('should throw when defaults is not an object', () => {
      const error = new TypeError(
        'options.sessionDataDefaults must be an object'
      )

      // @ts-expect-error - Type 'string' is not assignable
      assert.throws(() => setSessionData('not an object'), error)

      // @ts-expect-error - Type 'string[]' is not assignable
      assert.throws(() => setSessionData(['not an object']), error)
    })

    it('should call next with error when req.session does not exist', () => {
      delete req.session

      const middleware = setSessionData({})

      middleware(req, res, next)

      assert.deepEqual(
        next.mock.calls[0].arguments[0],
        new Error('Session middleware is not initialised')
      )
    })
  })
})

/**
 * @import { Mock } from 'node:test'
 * @import { NextFunction, Request, Response } from 'express'
 * @import { ObjectNested } from 'nhsuk-frontend'
 */
