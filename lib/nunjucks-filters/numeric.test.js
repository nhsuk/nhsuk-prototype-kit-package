import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { numeric } from './numeric.js'

describe('numeric', () => {
  it('matches numeric values', () => {
    assert.equal(numeric('0'), true)
    assert.equal(numeric('00'), true)
    assert.equal(numeric('1'), true)
    assert.equal(numeric('10'), true)
    assert.equal(numeric('01'), true)
    assert.equal(numeric('9991234567'), true)
  })

  it('matches number values', () => {
    assert.equal(numeric(0), true)
    assert.equal(numeric(-0), true)
    assert.equal(numeric(1), true)
    assert.equal(numeric(-1), true)
    assert.equal(numeric(150), true)
    assert.equal(numeric(-150), true)
    assert.equal(numeric(10000), true)
    assert.equal(numeric(10000000), true)
  })

  it('does not match non-numeric values', () => {
    assert.equal(numeric(), false)
    assert.equal(numeric(NaN), false)
    assert.equal(numeric(Infinity), false)
    assert.equal(numeric(null), false)
    assert.equal(numeric(undefined), false)
    assert.equal(numeric(false), false)
    assert.equal(numeric(true), false)
    assert.equal(numeric({}), false)
    assert.equal(numeric([]), false)
    assert.equal(numeric(''), false)
    assert.equal(numeric('AA'), false)
    assert.equal(numeric('1A'), false)
    assert.equal(numeric('A1'), false)
    assert.equal(numeric('1e'), false)
  })
})
