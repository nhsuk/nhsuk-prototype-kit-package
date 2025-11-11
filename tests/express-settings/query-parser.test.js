const assert = require('node:assert')
const { describe, it } = require('node:test')

const express = require('express')

const setQueryParser = require('../../lib/express-settings/query-parser')

const app = express()

describe('setQueryParser', () => {
  it('adds lets the app use extended query parsing', async () => {
    setQueryParser(app)

    assert.strictEqual(app.get('query parser'), 'extended')
  })
})
