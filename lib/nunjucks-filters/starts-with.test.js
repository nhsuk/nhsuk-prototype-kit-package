import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { startsWith } from './starts-with.js'

describe('startsWith', () => {
  it('matches string', () => {
    assert.equal(startsWith('NHS England', 'NHS'), true)
  })

  it('does not match string', () => {
    assert.equal(startsWith('DHSC', 'NHS'), false)
  })

  it('does not match with missing value', () => {
    assert.equal(startsWith('DHSC'), false)
  })

  it('handles number input', () => {
    assert.equal(startsWith(9991234567, '9991234567'), true)
    assert.equal(startsWith(9991234567, 9991234567), true)
  })
})
