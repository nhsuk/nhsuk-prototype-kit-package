import assert from 'node:assert'
import { describe, it } from 'node:test'

import NHSPrototypeKit, {
  middleware,
  nunjucksFilters,
  utils
} from 'nhsuk-prototype-kit'

describe('ES module named exports', () => {
  it('should export NHSPrototypeKit as default', () => {
    assert.ok(NHSPrototypeKit)
    assert.strictEqual(typeof NHSPrototypeKit, 'function')
  })

  it('should export middleware as a named export', () => {
    assert.ok(middleware)
    assert.strictEqual(typeof middleware, 'object')
    assert.strictEqual(typeof middleware.configure, 'function')
    assert.strictEqual(typeof middleware.autoRoutes, 'function')
  })

  it('should export nunjucksFilters as a named export', () => {
    assert.ok(nunjucksFilters)
    assert.strictEqual(typeof nunjucksFilters, 'object')
    assert.strictEqual(typeof nunjucksFilters.addAll, 'function')
    assert.strictEqual(typeof nunjucksFilters.formatNhsNumber, 'function')
    assert.strictEqual(typeof nunjucksFilters.log, 'function')
    assert.strictEqual(typeof nunjucksFilters.startsWith, 'function')
  })

  it('should export utils as a named export', () => {
    assert.ok(utils)
    assert.strictEqual(typeof utils, 'object')
    assert.strictEqual(typeof utils.findAvailablePort, 'function')
  })
})
