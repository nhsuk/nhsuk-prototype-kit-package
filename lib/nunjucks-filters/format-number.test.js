import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatNumber } from './format-number.js'

describe('formatNumber', () => {
  it('should format numeric strings with non-numeric characters', () => {
    assert.equal(formatNumber(' 999 123 4567 '), 9991234567)
    assert.equal(formatNumber(' 999-123-4567 '), 9991234567)
    assert.equal(formatNumber('999-123-4567'), 9991234567)
    assert.equal(formatNumber('999 123 4567'), 9991234567)
    assert.equal(formatNumber('999 1234567'), 9991234567)
    assert.equal(formatNumber('9991234567'), 9991234567)

    assert.equal(formatNumber('150kg'), 150)
    assert.equal(formatNumber('£10.50'), 10.5)
    assert.equal(formatNumber('10,000'), 10000)
    assert.equal(formatNumber('10,000,000'), 10000000)

    assert.equal(formatNumber('-150Nm'), -150)
    assert.equal(formatNumber('-£10.50'), -10.5)
    assert.equal(formatNumber('-10,000'), -10000)
    assert.equal(formatNumber('-10,000,000'), -10000000)
  })

  it('should format numeric strings with custom characters by regex string', () => {
    assert.equal(formatNumber('-999-123-4567-', '[^0-9]'), 9991234567)
    assert.equal(formatNumber('999-123-4567', '[^0-9]'), 9991234567)
    assert.equal(formatNumber('.999.123.4567.', '[^0-9]'), 9991234567)
    assert.equal(formatNumber('999.123.4567', '[^0-9]'), 9991234567)
  })

  it('should format numeric strings with unexpected decimal points', () => {
    assert.equal(formatNumber('10,000,000.00'), 10000000)
    assert.equal(formatNumber('10,000.000.00'), 10000000)
    assert.equal(formatNumber('10.000.000.00'), 10000000)
  })

  it('handles number input', () => {
    assert.equal(formatNumber(10000000.0), 10000000)
    assert.equal(formatNumber(9991234567), 9991234567)
  })

  it('does not handle non-numeric strings', () => {
    assert.equal(formatNumber('ABCDEFGH'), undefined)
    assert.equal(formatNumber('!@£$%^&*()'), undefined)
    assert.equal(formatNumber('!A@B£C$D%E'), undefined)
  })
})
