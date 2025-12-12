import assert from 'node:assert'
import { describe, it } from 'node:test'

import { startsWith } from './starts-with.js'

describe('startsWith', () => {
  it('matches string', () => {
    assert.strictEqual(startsWith('NHS England', 'NHS'), true)
  })

  it('does not match string', () => {
    assert.strictEqual(startsWith('DHSC', 'NHS'), false)
  })
})
