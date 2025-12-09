import assert from 'node:assert'
import { describe, it } from 'node:test'

import express from 'express'

import setViewEngine from './view-engine.js'

const app = express()

describe('setViewEngine', () => {
  it('adds sets the app to use HTML for its views', async () => {
    setViewEngine(app)

    assert.strictEqual(app.get('view engine'), 'html')
  })
})
