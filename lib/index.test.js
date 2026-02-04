import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import NHSPrototypeKit, {
  middleware,
  nunjucksFilters,
  utils
} from 'nhsuk-prototype-kit'

describe('ES module named exports', () => {
  it('should export NHSPrototypeKit as default', () => {
    assert.ok(NHSPrototypeKit)
    assert.equal(typeof NHSPrototypeKit, 'function')
  })

  it('should export middleware as a named export', () => {
    assert.ok(middleware)
    assert.equal(typeof middleware, 'object')
    assert.equal(typeof middleware.configure, 'function')
    assert.equal(typeof middleware.autoRoutes, 'function')
  })

  it('should export nunjucksFilters as a named export', () => {
    assert.ok(nunjucksFilters)
    assert.equal(typeof nunjucksFilters, 'object')
    assert.equal(typeof nunjucksFilters.addAll, 'function')
    assert.equal(typeof nunjucksFilters.formatNhsNumber, 'function')
    assert.equal(typeof nunjucksFilters.log, 'function')
    assert.equal(typeof nunjucksFilters.startsWith, 'function')
  })

  it('should export utils as a named export', () => {
    assert.ok(utils)
    assert.equal(typeof utils, 'object')
    assert.equal(typeof utils.findAvailablePort, 'function')
    assert.equal(typeof utils.getAvailablePort, 'function')
  })
})
