import assert from 'node:assert'
import { describe, it } from 'node:test'

import express from 'express'

import { setQueryParser } from './query-parser.js'

const app = express()

describe('setQueryParser', () => {
  it('adds lets the app use extended query parsing', async () => {
    setQueryParser(app)

    assert.strictEqual(app.get('query parser'), 'extended')
  })
})
