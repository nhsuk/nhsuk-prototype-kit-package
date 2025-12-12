import assert from 'node:assert'
import { describe, it } from 'node:test'

import { formatNhsNumber } from './format-nhs-number.js'

describe('formatNhsNumber', () => {
  it('should format a string of 10 digits', () => {
    assert.strictEqual(formatNhsNumber('9991231230'), '999 123 1230')
  })

  it('should format 10 digits as a number', () => {
    assert.strictEqual(formatNhsNumber(9991231230), '999 123 1230')
  })

  it('should format a string of 10 digits containing spaces', () => {
    assert.strictEqual(formatNhsNumber('9 991 23 123 0  '), '999 123 1230')
  })

  it('should format a string of 10 digits and other characters', () => {
    assert.strictEqual(formatNhsNumber('999-123-123-0'), '999 123 1230')
  })

  it('should not format a string of less than 10 digits', () => {
    assert.strictEqual(formatNhsNumber('99912345'), '99912345')
  })

  it('should not format a string of more than 10 digits', () => {
    assert.strictEqual(formatNhsNumber('9991234567123'), '9991234567123')
  })

  it('should return null for null', () => {
    assert.strictEqual(formatNhsNumber(null), null)
  })
})
