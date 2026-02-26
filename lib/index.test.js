import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import NHSPrototypeKit, {
  config,
  middleware,
  nunjucksFilters,
  utils
} from 'nhsuk-prototype-kit'

describe('ES module named exports', () => {
  it('should export NHSPrototypeKit as default', () => {
    assert.ok(NHSPrototypeKit)
    assert.equal(typeof NHSPrototypeKit, 'function')
  })

  it('should export config as a named export', () => {
    assert.ok(config)
    assert.equal(typeof config, 'object')
    assert.equal(typeof config.nhsukFrontendPath, 'string')
    assert.equal(typeof config.nhsukFrontendVersion, 'string')
    assert.equal(typeof config.prototypeKitPath, 'string')
    assert.equal(typeof config.prototypeKitVersion, 'string')
    assert.ok(config.modulePaths.every((path) => typeof path === 'string'))
    assert.ok(config.searchPaths.every((path) => typeof path === 'string'))
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
    assert.equal(typeof utils.addNunjucksFilters, 'function')
    assert.equal(typeof utils.findAvailablePort, 'function')
    assert.equal(typeof utils.getAvailablePort, 'function')
    assert.equal(typeof utils.getSessionName, 'function')
    assert.equal(typeof utils.normaliseOptions, 'function')
  })
})
