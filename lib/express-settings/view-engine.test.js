import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { setViewEngine } from './view-engine.js'

describe('setViewEngine', () => {
  const app = express()

  it('sets the app view engine file extension', async () => {
    setViewEngine(app)

    assert.equal(app.get('view engine'), 'html')
  })
})
