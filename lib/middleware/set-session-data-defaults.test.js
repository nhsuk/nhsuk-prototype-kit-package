import assert from 'node:assert/strict'
import { beforeEach, describe, it, mock } from 'node:test'

import { setSessionDataDefaults } from './set-session-data-defaults.js'

describe('setSessionDataDefaults middleware', () => {
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

    const middleware = setSessionDataDefaults({ defaults: {} })

    middleware(req, res, next)

    assert.deepEqual(req.session.data, {}, 'session.data should be initialised')
    assert.equal(next.mock.callCount(), 1)
  })

  it('should set default values when session.data is empty', () => {
    req.session.data = {}

    const middleware = setSessionDataDefaults({ defaults })

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

    const middleware = setSessionDataDefaults({ defaults })

    middleware(req, res, next)

    assert.deepEqual(req.session.data, updated)
    assert.equal(next.mock.callCount(), 1)
  })

  it('should throw TypeError when options.defaults is not provided', () => {
    assert.throws(() => setSessionDataDefaults(), {
      name: 'TypeError',
      message: 'options.defaults must be an object'
    })
  })

  it('should throw TypeError when options.defaults is not an object', () => {
    // @ts-expect-error - Type 'string' is not assignable
    assert.throws(() => setSessionDataDefaults({ defaults: 'not an object' }), {
      name: 'TypeError',
      message: 'options.defaults must be an object'
    })
  })

  it('should throw TypeError when options.defaults is null', () => {
    assert.throws(() => setSessionDataDefaults({ defaults: null }), {
      name: 'TypeError',
      message: 'options.defaults must be an object'
    })
  })

  it('should call next with error when req.session does not exist', () => {
    delete req.session

    const middleware = setSessionDataDefaults({ defaults: {} })

    middleware(req, res, next)

    assert.deepEqual(
      next.mock.calls[0].arguments[0],
      new Error(
        'Session middleware must be initialised before setSessionDataDefaults'
      )
    )
  })
})

/**
 * @import { Mock } from 'node:test'
 * @import { NextFunction, Request, Response } from 'express'
 * @import { ObjectNested } from 'nhsuk-frontend'
 */
