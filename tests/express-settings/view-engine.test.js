const { describe, it } = require('node:test')
const assert = require('node:assert')
const setViewEngine = require('../../lib/express-settings/view-engine')
const express = require('express')
const app = express()

describe('setViewEngine', () => {
  it('adds sets the app to use HTML for its views', async () => {
    setViewEngine(app)

    assert.strictEqual(app.get('view engine'), 'html')
  })
})
