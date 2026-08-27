import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { isNumeric } from './is-numeric.js'

describe('numeric', () => {
  it('matches numeric values', () => {
    assert.equal(isNumeric('0'), true)
    assert.equal(isNumeric('00'), true)
    assert.equal(isNumeric('1'), true)
    assert.equal(isNumeric('10'), true)
    assert.equal(isNumeric('01'), true)
    assert.equal(isNumeric('9991234567'), true)
  })

  it('matches number values', () => {
    assert.equal(isNumeric(0), true)
    assert.equal(isNumeric(-0), true)
    assert.equal(isNumeric(1), true)
    assert.equal(isNumeric(-1), true)
    assert.equal(isNumeric(150), true)
    assert.equal(isNumeric(-150), true)
    assert.equal(isNumeric(10000), true)
    assert.equal(isNumeric(10000000), true)
  })

  it('does not match non-numeric values', () => {
    assert.equal(isNumeric(), false)
    assert.equal(isNumeric(NaN), false)
    assert.equal(isNumeric(Infinity), false)
    assert.equal(isNumeric(null), false)
    assert.equal(isNumeric(undefined), false)
    assert.equal(isNumeric(false), false)
    assert.equal(isNumeric(true), false)
    assert.equal(isNumeric({}), false)
    assert.equal(isNumeric([]), false)
    assert.equal(isNumeric(''), false)
    assert.equal(isNumeric('AA'), false)
    assert.equal(isNumeric('1A'), false)
    assert.equal(isNumeric('A1'), false)
    assert.equal(isNumeric('1e'), false)
  })
})
