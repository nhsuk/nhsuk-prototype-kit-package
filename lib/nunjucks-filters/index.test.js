import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import * as nunjucks from 'nhsuk-frontend/lib/nunjucks/environment.mjs'

import { addAll } from './index.js'

describe('addAll', () => {
  it('returns the nunjucksEnv so that it is chainable', () => {
    const nunjucksEnv = nunjucks.configure()

    const result = addAll(nunjucksEnv)

    assert.equal(result, nunjucksEnv)
  })
})
