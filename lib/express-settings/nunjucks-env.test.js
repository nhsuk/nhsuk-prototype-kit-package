import assert from 'node:assert/strict'
import { describe, it, beforeEach } from 'node:test'

import express from 'express'
import nunjucks from 'nunjucks'

import { setNunjucksEnv } from './nunjucks-env.js'

describe('setNunjucksEnv', () => {
  let /** @type {Express} */ app
  let /** @type {Environment} */ nunjucksEnv

  beforeEach(() => {
    app = express()
    nunjucksEnv = nunjucks.configure(['views'])
  })

  it('sets the app Nunjucks environment', async () => {
    setNunjucksEnv(app, { nunjucks: nunjucksEnv })

    assert.equal(app.get('nunjucksEnv'), nunjucksEnv)
  })

  it('preserves an existing Nunjucks environment', async () => {
    const nunjucksEnvCustom = nunjucks.configure(['views'])
    nunjucksEnvCustom.express(app)

    setNunjucksEnv(app, { nunjucks: nunjucksEnv })

    assert.equal(app.get('nunjucksEnv'), nunjucksEnvCustom)
  })
})

/**
 * @import { Express } from 'express'
 * @import { Environment } from 'nunjucks'
 */
