const assert = require('node:assert')
const { describe, it } = require('node:test')

const express = require('express')

const setViewEngine = require('./view-engine')

const app = express()

describe('setViewEngine', () => {
  it('adds sets the app to use HTML for its views', async () => {
    setViewEngine(app)

    assert.strictEqual(app.get('view engine'), 'html')
  })
})
