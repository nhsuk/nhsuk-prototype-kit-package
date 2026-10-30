import assert from 'node:assert/strict'
import { beforeEach, describe, it, mock } from 'node:test'

import { autoStoreData } from './auto-store-data.js'
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

  it('should not share nested default objects between sessions', () => {
    const defaults = {
      settings: { colour: 'blue' },
      items: [{ name: 'one' }]
    }
    const middleware = setSessionDataDefaults({ defaults })

    const req1 = /** @type {Request} */ ({ session: {} })
    const req2 = /** @type {Request} */ ({ session: {} })

    middleware(req1, res, next)

    const data1 = /** @type {typeof defaults} */ (req1.session.data)
    data1.settings.colour = 'red'
    data1.items[0].name = 'changed'
    data1.items.push({ name: 'two' })

    middleware(req2, res, next)

    assert.deepEqual(req2.session.data, {
      settings: { colour: 'blue' },
      items: [{ name: 'one' }]
    })
    assert.deepEqual(defaults, {
      settings: { colour: 'blue' },
      items: [{ name: 'one' }]
    })
  })

  it('should not share nested defaults re-added to existing session data', () => {
    const defaults = { settings: { colour: 'blue' } }
    const middleware = setSessionDataDefaults({ defaults })

    // Existing session where the nested key has been removed
    req.session.data = { other: 'value' }
    middleware(req, res, next)

    const data = /** @type {typeof defaults} */ (req.session.data)
    data.settings.colour = 'purple'

    const freshReq = /** @type {Request} */ ({ session: {} })
    middleware(freshReq, res, next)

    assert.deepEqual(freshReq.session.data.settings, { colour: 'blue' })
    assert.deepEqual(defaults.settings, { colour: 'blue' })
  })

  it('should not let nested form or query data change defaults for other sessions', () => {
    const middleware = setSessionDataDefaults({
      defaults: { settings: { colour: 'blue' } }
    })

    const req1 = /** @type {Request} */ (
      /** @type {unknown} */ ({
        session: {},
        body: {},
        query: { settings: { colour: 'red' } }
      })
    )
    const req2 = /** @type {Request} */ ({
      session: {},
      body: {},
      query: {}
    })

    middleware(req1, res, next)
    autoStoreData(req1, /** @type {Response} */ ({ locals: {} }), next)

    middleware(req2, res, next)
    autoStoreData(req2, /** @type {Response} */ ({ locals: {} }), next)

    assert.deepEqual(req1.session.data.settings, { colour: 'red' })
    assert.deepEqual(req2.session.data.settings, { colour: 'blue' })
  })

  it('should not share nested dates, sets or class instances between sessions', () => {
    class Preferences {
      colour = 'blue'
    }

    const defaults = {
      appointment: { date: new Date('2026-01-01') },
      preferences: new Preferences(),
      tags: new Set(['one'])
    }
    const middleware = setSessionDataDefaults({ defaults })

    const req1 = /** @type {Request} */ ({ session: {} })
    const req2 = /** @type {Request} */ ({ session: {} })

    middleware(req1, res, next)

    const data1 = /** @type {typeof defaults} */ (req1.session.data)
    data1.appointment.date.setFullYear(1999)
    data1.preferences.colour = 'red'
    data1.tags.add('two')

    middleware(req2, res, next)

    const data2 = /** @type {typeof defaults} */ (req2.session.data)
    assert.equal(data2.appointment.date.getFullYear(), 2026)
    assert.equal(data2.preferences.colour, 'blue')
    assert.deepEqual([...data2.tags], ['one'])
    assert.equal(defaults.appointment.date.getFullYear(), 2026)
    assert.equal(defaults.preferences.colour, 'blue')
    assert.deepEqual([...defaults.tags], ['one'])
  })

  it('should not be affected by later changes to the original defaults', () => {
    const defaults = { settings: { colour: 'blue' } }
    const middleware = setSessionDataDefaults({ defaults })

    defaults.settings.colour = 'red'

    middleware(req, res, next)

    assert.deepEqual(req.session.data.settings, { colour: 'blue' })
  })

  it('should throw TypeError when options.defaults cannot be cloned', () => {
    assert.throws(
      () => {
        setSessionDataDefaults({
          defaults: { nested: { format: () => 'formatted' } }
        })
      },
      {
        name: 'TypeError',
        message:
          'options.defaults must only contain values that can be cloned, such as strings, numbers, arrays and objects (not functions)'
      }
    )
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
