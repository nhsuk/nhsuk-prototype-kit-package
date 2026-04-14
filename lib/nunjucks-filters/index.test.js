import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import nunjucks from 'nunjucks'

import { addAll } from './index.js'

describe('addAll', () => {
  it('returns the nunjucksEnv so that it is chainable', () => {
    const nunjucksEnv = new nunjucks.Environment()

    const result = addAll(nunjucksEnv)

    assert.equal(result, nunjucksEnv)
  })
})
