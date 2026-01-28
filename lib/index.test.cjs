const assert = require('node:assert')
const { describe, it } = require('node:test')

const express = require('express')
const nunjucks = require('nunjucks')

const NHSPrototypeKit = require('./index.cjs')

describe('CommonJS default exports', () => {
  it('should export NHSPrototypeKit as default', () => {
    assert.ok(NHSPrototypeKit)
    assert.strictEqual(typeof NHSPrototypeKit, 'function')
  })

  it('should have init method', () => {
    assert.strictEqual(typeof NHSPrototypeKit.init, 'function')
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
    assert.strictEqual(typeof middleware, 'object')
    assert.strictEqual(typeof middleware.configure, 'function')
    assert.strictEqual(typeof middleware.autoRoutes, 'function')
  })

  it('should export nunjucksFilters', () => {
    assert.ok(nunjucksFilters)
    assert.strictEqual(typeof nunjucksFilters, 'object')
    assert.strictEqual(typeof nunjucksFilters.addAll, 'function')
    assert.strictEqual(typeof nunjucksFilters.formatNhsNumber, 'function')
    assert.strictEqual(typeof nunjucksFilters.startsWith, 'function')
  })

  it('should export utils', () => {
    assert.ok(utils)
    assert.strictEqual(typeof utils, 'object')
    assert.strictEqual(typeof utils.findAvailablePort, 'function')
  })
})
