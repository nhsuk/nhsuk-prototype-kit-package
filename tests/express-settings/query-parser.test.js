const { describe, it } = require('node:test')
const assert = require('node:assert')
const setQueryParser = require('../../lib/express-settings/query-parser')
const express = require('express')
const app = express()

describe('setQueryParser', () => {
  it('adds lets the app use extended query parsing', async () => {
    setQueryParser(app)

    assert.strictEqual(app.get('query parser'), 'extended')
  })
})
