import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { setViewEngine } from './view-engine.js'

describe('setViewEngine', () => {
  const app = express()

  it('adds sets the app to use HTML for its views', async () => {
    setViewEngine(app)

    assert.equal(app.get('view engine'), 'html')
  })
})
