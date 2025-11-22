const assert = require('node:assert')
const { describe, it, beforeEach } = require('node:test')

const autoStoreData = require('../../lib/express-middleware/auto-store-data')

describe('autoStoreData middleware', () => {
  let req, res, nextCalled

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      session: {}
    }
    res = {
      locals: {}
    }
    nextCalled = false
  })

  const next = () => {
    nextCalled = true
  }

  describe('session initialization', () => {
    it('should initialize req.session.data if it does not exist', () => {
      autoStoreData(req, res, next)

      assert.ok(req.session.data, 'session.data should be initialized')
      assert.deepStrictEqual(req.session.data, {})
    })

    it('should preserve existing session.data', () => {
      req.session.data = { existingKey: 'existingValue' }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.existingKey, 'existingValue')
    })

    it('should call next()', () => {
      autoStoreData(req, res, next)

      assert.strictEqual(nextCalled, true)
    })
  })

  describe('storing data from POST body', () => {
    it('should store simple values from body', () => {
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        age: '30'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.firstName, 'John')
      assert.strictEqual(req.session.data.lastName, 'Doe')
      assert.strictEqual(req.session.data.age, '30')
    })

    it('should store array values from body', () => {
      req.body = {
        colors: ['red', 'blue', 'green']
      }

      autoStoreData(req, res, next)

      assert.deepStrictEqual(req.session.data.colors, ['red', 'blue', 'green'])
    })

    it('should store nested objects from body', () => {
      req.body = {
        address: {
          street: '123 Main St',
          city: 'London',
          postcode: 'SW1A 1AA'
        }
      }

      autoStoreData(req, res, next)

      assert.deepStrictEqual(req.session.data.address, {
        street: '123 Main St',
        city: 'London',
        postcode: 'SW1A 1AA'
      })
    })
  })

  describe('storing data from GET query', () => {
    it('should store simple values from query', () => {
      req.query = {
        search: 'test query',
        page: '2'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.search, 'test query')
      assert.strictEqual(req.session.data.page, '2')
    })

    it('should store array values from query', () => {
      req.query = {
        tags: ['javascript', 'nodejs']
      }

      autoStoreData(req, res, next)

      assert.deepStrictEqual(req.session.data.tags, ['javascript', 'nodejs'])
    })
  })

  describe('combining body and query data', () => {
    it('should store data from both body and query', () => {
      req.body = {
        name: 'John'
      }
      req.query = {
        id: '123'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.name, 'John')
      assert.strictEqual(req.session.data.id, '123')
    })

    it('should give query priority over body when both have same key', () => {
      req.body = {
        value: 'from-body'
      }
      req.query = {
        value: 'from-query'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.value, 'from-query')
    })
  })

  describe('ignoring fields starting with underscore', () => {
    it('should ignore fields starting with underscore in body', () => {
      req.body = {
        name: 'John',
        _csrf: 'token123',
        _internal: 'value'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.name, 'John')
      assert.strictEqual(req.session.data._csrf, undefined)
      assert.strictEqual(req.session.data._internal, undefined)
    })

    it('should ignore fields starting with underscore in query', () => {
      req.query = {
        search: 'test',
        _debug: 'true'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.search, 'test')
      assert.strictEqual(req.session.data._debug, undefined)
    })
  })

  describe('handling _unchecked values', () => {
    it('should delete field when value is _unchecked', () => {
      req.session.data = {
        newsletter: 'yes',
        updates: 'yes'
      }
      req.body = {
        newsletter: '_unchecked'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.newsletter, undefined)
      assert.strictEqual(req.session.data.updates, 'yes')
    })

    it('should filter _unchecked from array values', () => {
      req.body = {
        preferences: ['email', '_unchecked', 'sms', '_unchecked']
      }

      autoStoreData(req, res, next)

      assert.deepStrictEqual(req.session.data.preferences, ['email', 'sms'])
    })

    it('should handle array with all _unchecked values', () => {
      req.body = {
        options: ['_unchecked', '_unchecked']
      }

      autoStoreData(req, res, next)

      assert.deepStrictEqual(req.session.data.options, [])
    })

    it('should handle array with no _unchecked values', () => {
      req.body = {
        colors: ['red', 'blue']
      }

      autoStoreData(req, res, next)

      assert.deepStrictEqual(req.session.data.colors, ['red', 'blue'])
    })
  })

  describe('handling nested objects', () => {
    it('should merge nested objects', () => {
      req.session.data = {
        user: {
          name: 'John',
          email: 'john@example.com'
        }
      }
      req.body = {
        user: {
          email: 'newemail@example.com',
          phone: '123456789'
        }
      }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.user.name, 'John')
      assert.strictEqual(req.session.data.user.email, 'newemail@example.com')
      assert.strictEqual(req.session.data.user.phone, '123456789')
    })

    it('should create nested object if it does not exist', () => {
      req.body = {
        profile: {
          firstName: 'Jane',
          lastName: 'Smith'
        }
      }

      autoStoreData(req, res, next)

      assert.deepStrictEqual(req.session.data.profile, {
        firstName: 'Jane',
        lastName: 'Smith'
      })
    })

    it('should handle deeply nested objects', () => {
      req.body = {
        address: {
          home: {
            street: '123 Main St',
            city: 'London'
          }
        }
      }

      autoStoreData(req, res, next)

      assert.deepStrictEqual(req.session.data.address.home, {
        street: '123 Main St',
        city: 'London'
      })
    })

    it('should replace non-object values with objects when nested data is provided', () => {
      req.session.data = {
        user: 'simple-string'
      }
      req.body = {
        user: {
          name: 'John'
        }
      }

      autoStoreData(req, res, next)

      assert.deepStrictEqual(req.session.data.user, {
        name: 'John'
      })
    })

    it('should ignore nested fields starting with underscore', () => {
      req.body = {
        user: {
          name: 'John',
          _internal: 'value'
        }
      }

      autoStoreData(req, res, next)

      assert.strictEqual(req.session.data.user.name, 'John')
      assert.strictEqual(req.session.data.user._internal, undefined)
    })
  })

  describe('setting res.locals.data', () => {
    it('should copy session.data to res.locals.data', () => {
      req.body = {
        name: 'John',
        age: '30'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(res.locals.data.name, 'John')
      assert.strictEqual(res.locals.data.age, '30')
    })

    it('should copy existing session.data to res.locals.data', () => {
      req.session.data = {
        existingKey: 'existingValue',
        anotherKey: 'anotherValue'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(res.locals.data.existingKey, 'existingValue')
      assert.strictEqual(res.locals.data.anotherKey, 'anotherValue')
    })

    it('should initialize res.locals.data as empty object when session.data is empty', () => {
      autoStoreData(req, res, next)

      assert.ok(res.locals.data)
      assert.deepStrictEqual(res.locals.data, {})
    })

    it('should reflect updates from body in res.locals.data', () => {
      req.session.data = {
        name: 'John'
      }
      req.body = {
        name: 'Jane',
        email: 'jane@example.com'
      }

      autoStoreData(req, res, next)

      assert.strictEqual(res.locals.data.name, 'Jane')
      assert.strictEqual(res.locals.data.email, 'jane@example.com')
    })
  })

  describe('complex scenarios', () => {
    it('should handle combination of all features', () => {
      req.session.data = {
        user: {
          name: 'John',
          preferences: {
            theme: 'dark'
          }
        },
        newsletter: 'yes'
      }
      req.body = {
        user: {
          email: 'john@example.com'
        },
        newsletter: '_unchecked',
        colors: ['red', '_unchecked', 'blue'],
        _csrf: 'token'
      }
      req.query = {
        page: '1',
        _debug: 'true'
      }

      autoStoreData(req, res, next)

      // Nested object should be merged
      assert.strictEqual(req.session.data.user.name, 'John')
      assert.strictEqual(req.session.data.user.email, 'john@example.com')
      assert.deepStrictEqual(req.session.data.user.preferences, {
        theme: 'dark'
      })

      // _unchecked should delete the field
      assert.strictEqual(req.session.data.newsletter, undefined)

      // _unchecked should be filtered from array
      assert.deepStrictEqual(req.session.data.colors, ['red', 'blue'])

      // Fields starting with _ should be ignored
      assert.strictEqual(req.session.data._csrf, undefined)
      assert.strictEqual(req.session.data._debug, undefined)

      // Query data should be stored
      assert.strictEqual(req.session.data.page, '1')

      // All data should be in res.locals.data
      assert.strictEqual(res.locals.data.page, '1')
      assert.deepStrictEqual(res.locals.data.colors, ['red', 'blue'])

      // next should be called
      assert.strictEqual(nextCalled, true)
    })
  })
})
