import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { setViews } from './views.js'

describe('setViews', () => {
  it('sets the app views paths', async () => {
    const app = express()
    const viewsPath = ['views']
    setViews(app, { viewsPath })

    assert.deepEqual(app.get('views'), viewsPath)
  })

  it('sets the app views paths from a string', async () => {
    const app = express()
    setViews(app, { viewsPath: 'app/views' })

    assert.deepEqual(app.get('views'), ['app/views'])
  })

  it('keeps the Express.js default views path when none are provided', async () => {
    const app = express()
    const defaultViews = app.get('views')
    setViews(app, { viewsPath: [] })

    assert.equal(app.get('views'), defaultViews)
  })
})
