import assert from 'node:assert/strict'
import { beforeEach, describe, it, mock } from 'node:test'

import { autoStoreData } from './auto-store-data.js'
import { setSessionData } from './set-session-data-defaults.js'

describe('setSessionData middleware', () => {
  let /** @type {Request} */ req
  let /** @type {Response} */ res
  let /** @type {Mock<NextFunction>} */ next
  let /** @type {MockDefaults} */ defaults

  beforeEach(() => {
    req = /** @type {Request} */ ({
      session: {}
    })

    res = /** @type {Response} */ ({
      locals: {}
    })

    next = mock.fn()

    defaults = /** @type {MockDefaults} */ ({
      name: 'John Doe',
      age: 30,
      birthday: new Date('1996-01-01'),
      contact: {
        email: 'john@example.com'
      },
      items: ['one', 'two']
    })
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
      birthday: defaults.birthday,
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

  describe('session isolation', () => {
    let /** @type {Request} */ req1
    let /** @type {Request} */ req2

    beforeEach(() => {
      req1 = /** @type {Request} */ ({
        session: {}
      })

      req2 = /** @type {Request} */ ({
        session: {}
      })
    })

    it('should give each session its own copy of nested defaults', () => {
      const middleware = setSessionData(defaults)

      middleware(req1, res, next)
      middleware(req2, res, next)

      // Request 1: Birthday equals defaults as separate date
      assert.deepEqual(req1.session.data.birthday, defaults.birthday)
      assert.notEqual(req1.session.data.birthday, defaults.birthday)

      // Request 1: Contact details equal defaults as separate object
      assert.deepEqual(req1.session.data.contact, defaults.contact)
      assert.notEqual(req1.session.data.contact, defaults.contact)

      // Request 1: Items equal defaults as separate array
      assert.deepEqual(req1.session.data.items, defaults.items)
      assert.notEqual(req1.session.data.items, defaults.items)

      // Request 2: Birthday equals defaults as separate date
      assert.deepEqual(req2.session.data.birthday, defaults.birthday)
      assert.notEqual(req2.session.data.birthday, defaults.birthday)

      // Request 2: Contact details equal defaults as separate object
      assert.deepEqual(req2.session.data.contact, defaults.contact)
      assert.notEqual(req2.session.data.contact, defaults.contact)

      // Request 2: Items equal defaults as separate array
      assert.deepEqual(req2.session.data.items, defaults.items)
      assert.notEqual(req2.session.data.items, defaults.items)

      // Values passed by reference are equal but separate
      assert.deepEqual(req1.session.data.birthday, req2.session.data.birthday)
      assert.notEqual(req1.session.data.birthday, req2.session.data.birthday)
      assert.deepEqual(req1.session.data.contact, req2.session.data.contact)
      assert.notEqual(req1.session.data.contact, req2.session.data.contact)
      assert.deepEqual(req1.session.data.items, req2.session.data.items)
      assert.notEqual(req1.session.data.items, req2.session.data.items)

      // All other values are equal
      assert.equal(req1.session.data.name, req2.session.data.name)
      assert.equal(req1.session.data.age, req2.session.data.age)
    })

    it('should not leak session changes (via body) into defaults for new sessions', () => {
      const original = structuredClone(defaults)

      const update = {
        name: 'Jane Smith',
        contact: {
          email: 'jane@example.com'
        }
      }

      const updated = structuredClone({
        name: 'Jane Smith',
        age: original.age,
        birthday: original.birthday,
        contact: {
          email: 'jane@example.com'
        },
        items: original.items
      })

      req1.body = update

      const middleware = setSessionData(defaults)

      // Request 1 with body
      middleware(req1, res, next)
      autoStoreData(req1, res, next)

      // Request 2 without body
      middleware(req2, res, next)
      autoStoreData(req2, res, next)

      assert.deepEqual(req1.session.data, updated)
      assert.deepEqual(req2.session.data, original)
    })

    it('should not leak session changes (via query) into defaults for new sessions', () => {
      const original = structuredClone(defaults)

      const update = {
        name: 'Jane Smith',
        contact: {
          email: 'jane@example.com'
        }
      }

      const updated = structuredClone({
        name: 'Jane Smith',
        age: original.age,
        birthday: original.birthday,
        contact: {
          email: 'jane@example.com'
        },
        items: original.items
      })

      req1.query = update

      const middleware = setSessionData(defaults)

      // Request 1 with query
      middleware(req1, res, next)
      autoStoreData(req1, res, next)

      // Request 2 without query
      middleware(req2, res, next)
      autoStoreData(req2, res, next)

      assert.deepEqual(req1.session.data, updated)
      assert.deepEqual(req2.session.data, original)
    })

    it('should give each session its own copy of nested defaults re-added to existing sessions', () => {
      const original = structuredClone(defaults)

      // Set defaults
      const middleware = setSessionData(defaults)

      const updated = structuredClone({
        name: original.name,
        age: original.age,
        birthday: original.birthday,
        items: original.items
      })

      // Remove contact details
      req1.body = {
        contact: '_unchecked'
      }

      // Request 1 with body
      middleware(req1, res, next)
      autoStoreData(req1, res, next)

      // Request 2 without body
      middleware(req2, res, next)

      assert.deepEqual(req1.session.data, updated)
      assert.deepEqual(req2.session.data, original)

      delete req1.body

      // Request 1 (again) without body
      middleware(req1, res, next)
      autoStoreData(req1, res, next)

      // Request 2 (again) without body
      middleware(req2, res, next)

      assert.deepEqual(req1.session.data, original)
      assert.deepEqual(req2.session.data, original)

      assert.deepEqual(req1.session.data.contact, req2.session.data.contact)
      assert.notEqual(req1.session.data.contact, req2.session.data.contact)
    })

    it('should not be affected by changes to the original defaults', () => {
      const original = structuredClone(defaults)

      // Set defaults
      const middleware = setSessionData(defaults)

      // Modify defaults
      defaults.name = 'Changed'
      defaults.age = 1
      defaults.birthday.setFullYear(2030)
      defaults.contact.email = 'changed@example.com'
      defaults.items.push('three')

      middleware(req1, res, next)

      assert.deepEqual(req1.session.data, original)
    })
  })

  describe('error handling', () => {
    it('should not throw without defaults', () => {
      assert.doesNotThrow(() => setSessionData())
      assert.doesNotThrow(() => setSessionData(null))
      assert.doesNotThrow(() => setSessionData(undefined))

      // @ts-expect-error - Type 'boolean' is not assignable
      assert.doesNotThrow(() => setSessionData(false))
    })

    it('should throw when defaults cannot be cloned', () => {
      assert.throws(() => setSessionData({ format: () => 'formatted' }), {
        name: 'DataCloneError',
        message: "() => 'formatted' could not be cloned."
      })
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
 * @typedef {object} MockSession
 * @property {string} [name] - Name
 * @property {number} [age] - Age
 * @property {Date} [birthday] - Date of birth
 * @property {object} [contact] - Contact information
 * @property {string} [contact.email] - Email address
 * @property {string[]} [items] - List of items
 */

/**
 * @typedef {MockSession & ObjectNested} MockDefaults
 */

/**
 * @import { Mock } from 'node:test'
 * @import { NextFunction, Request, Response } from 'express'
 * @import { ObjectNested } from 'nhsuk-frontend'
 */
