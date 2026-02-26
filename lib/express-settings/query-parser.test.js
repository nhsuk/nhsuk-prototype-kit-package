import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { setQueryParser } from './query-parser.js'

describe('setQueryParser', () => {
  const app = express()

  it('sets the app to use extended query parsing', async () => {
    setQueryParser(app)

    assert.equal(app.get('query parser'), 'extended')
  })
})
