import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { addAll } from './index.js'

describe('addAll', () => {
  it('returns the nunjucksEnv so that it is chainable', () => {
    const mockNunjucksEnv = {
      addFilter: () => {}
    }

    const result = addAll(mockNunjucksEnv)

    assert.equal(result, mockNunjucksEnv)
  })
})
