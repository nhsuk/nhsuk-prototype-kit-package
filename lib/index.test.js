import assert from 'node:assert'
import { describe, it } from 'node:test'

import NHSPrototypeKit, { middleware, nunjucksFilters, utils } from './index.js'

describe('index.js named exports', () => {
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
    assert.strictEqual(typeof nunjucksFilters.startsWith, 'function')
  })

  it('should export utils as a named export', () => {
    assert.ok(utils)
    assert.strictEqual(typeof utils, 'object')
    assert.strictEqual(typeof utils.findAvailablePort, 'function')
  })

  it('middleware export should match NHSPrototypeKit.middleware', () => {
    assert.strictEqual(middleware, NHSPrototypeKit.middleware)
  })

  it('nunjucksFilters export should match NHSPrototypeKit.nunjucksFilters', () => {
    assert.strictEqual(nunjucksFilters, NHSPrototypeKit.nunjucksFilters)
  })

  it('utils export should match NHSPrototypeKit.utils', () => {
    assert.strictEqual(utils, NHSPrototypeKit.utils)
  })
})
