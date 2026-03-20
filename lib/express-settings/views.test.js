import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { setViews } from './views.js'

describe('setViews', () => {
  const app = express()

  it('sets the app views search paths', async () => {
    const viewsPath = ['views']
    setViews(app, { viewsPath })

    assert.equal(app.get('views'), viewsPath)
  })
})
