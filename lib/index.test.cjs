const assert = require('node:assert')
const { describe, it } = require('node:test')

const express = require('express')
const nunjucks = require('nunjucks')

const NHSPrototypeKit = require('./index.cjs')

describe('index.cjs CommonJS exports', () => {
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
