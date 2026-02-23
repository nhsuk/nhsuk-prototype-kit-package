const assert = require('node:assert/strict')
const { describe, it } = require('node:test')

const express = require('express')
const nunjucks = require('nunjucks')

const NHSPrototypeKit = require('./index.cjs')
const { config, middleware, nunjucksFilters, utils } = NHSPrototypeKit

describe('CommonJS default exports', () => {
  it('should export NHSPrototypeKit as default', () => {
    assert.ok(NHSPrototypeKit)
    assert.equal(typeof NHSPrototypeKit, 'function')
  })

  it('should export config as static property', () => {
    assert.ok(config)
    assert.equal(typeof config, 'object')
    assert.equal(typeof config.nhsukFrontendPath, 'string')
    assert.equal(typeof config.nhsukFrontendVersion, 'string')
    assert.equal(typeof config.prototypeKitPath, 'string')
    assert.equal(typeof config.prototypeKitVersion, 'string')
    assert.equal(typeof config.modulesPath, 'string')
    assert.ok(config.searchPaths.every((path) => typeof path === 'string'))
  })

  it('should export middleware as static property', () => {
    assert.ok(middleware)
    assert.equal(typeof middleware, 'object')
    assert.equal(typeof middleware.configure, 'function')
    assert.equal(typeof middleware.autoRoutes, 'function')
  })

  it('should export nunjucksFilters as static property', () => {
    assert.ok(nunjucksFilters)
    assert.equal(typeof nunjucksFilters, 'object')
    assert.equal(typeof nunjucksFilters.addAll, 'function')
    assert.equal(typeof nunjucksFilters.formatNhsNumber, 'function')
    assert.equal(typeof nunjucksFilters.log, 'function')
    assert.equal(typeof nunjucksFilters.startsWith, 'function')
  })

  it('should export utils as static property', () => {
    assert.ok(utils)
    assert.equal(typeof utils, 'object')
    assert.equal(typeof utils.addNunjucksFilters, 'function')
    assert.equal(typeof utils.findAvailablePort, 'function')
    assert.equal(typeof utils.getAvailablePort, 'function')
    assert.equal(typeof utils.normaliseOptions, 'function')
  })

  it('should have init method', () => {
    assert.equal(typeof NHSPrototypeKit.init, 'function')
  })

  it('should be able to create instances', () => {
    const instance = new NHSPrototypeKit({
      app: express(),
      nunjucks: nunjucks.configure([])
    })
    assert.ok(instance)
    assert.ok(instance.app)
    assert.ok(instance.nunjucks)
  })
})

describe('CommonJS package exports', () => {
  const middleware = require('nhsuk-prototype-kit/middleware')
  const nunjucksFilters = require('nhsuk-prototype-kit/nunjucks-filters')
  const utils = require('nhsuk-prototype-kit/utils')

  it('should export middleware', () => {
    assert.ok(middleware)
    assert.equal(typeof middleware, 'object')
    assert.equal(typeof middleware.configure, 'function')
    assert.equal(typeof middleware.autoRoutes, 'function')
  })

  it('should export nunjucksFilters', () => {
    assert.ok(nunjucksFilters)
    assert.equal(typeof nunjucksFilters, 'object')
    assert.equal(typeof nunjucksFilters.addAll, 'function')
    assert.equal(typeof nunjucksFilters.formatNhsNumber, 'function')
    assert.equal(typeof nunjucksFilters.log, 'function')
    assert.equal(typeof nunjucksFilters.startsWith, 'function')
  })

  it('should export utils', () => {
    assert.ok(utils)
    assert.equal(typeof utils, 'object')
    assert.equal(typeof utils.addNunjucksFilters, 'function')
    assert.equal(typeof utils.findAvailablePort, 'function')
    assert.equal(typeof utils.getAvailablePort, 'function')
    assert.equal(typeof utils.normaliseOptions, 'function')
  })
})
