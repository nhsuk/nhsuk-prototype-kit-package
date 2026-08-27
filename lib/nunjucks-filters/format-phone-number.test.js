import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatPhoneNumber } from './format-phone-number.js'

describe('formatPhoneNumber', () => {
  it('should format phone numbers', () => {
    assert.equal(formatPhoneNumber('111'), '111')
    assert.equal(formatPhoneNumber('999'), '999')
    assert.equal(formatPhoneNumber('01273800900'), '01273 800900')
    assert.equal(formatPhoneNumber('02074504000'), '020 7450 4000')
    assert.equal(formatPhoneNumber('07700900866'), '07700 900866')
    assert.equal(formatPhoneNumber('0800890567'), '0800 890567')
    assert.equal(formatPhoneNumber('08001111'), '0800 1111')
  })

  it('should format phone numbers (with country code)', () => {
    assert.equal(formatPhoneNumber('01273800900', 'GB'), '+44 1273 800900')
    assert.equal(formatPhoneNumber('02074504000', 'GB'), '+44 20 7450 4000')
    assert.equal(formatPhoneNumber('07700900866', 'GB'), '+44 7700 900866')
    assert.equal(formatPhoneNumber('0800890567', 'GB'), '+44 800 890567')
    assert.equal(formatPhoneNumber('08001111', 'GB'), '+44 800 1111')

    assert.equal(formatPhoneNumber('8005550100', 'US'), '+1 800 555 0100')
    assert.equal(formatPhoneNumber('133457090', 'IT'), '+39 133457090')
  })

  it('should format phone numbers (with country code, national)', () => {
    assert.equal(
      formatPhoneNumber('01273800900', 'GB', 'NATIONAL'),
      '01273 800900'
    )

    assert.equal(
      formatPhoneNumber('02074504000', 'GB', 'NATIONAL'),
      '020 7450 4000'
    )

    assert.equal(
      formatPhoneNumber('0800890567', 'GB', 'NATIONAL'),
      '0800 890567'
    )

    assert.equal(
      formatPhoneNumber('07700900866', 'GB', 'NATIONAL'),
      '07700 900866'
    )

    assert.equal(
      formatPhoneNumber('8005550100', 'US', 'NATIONAL'),
      '(800) 555-0100'
    )

    assert.equal(formatPhoneNumber('133457090', 'IT', 'NATIONAL'), '133457090')
  })

  it('should format phone numbers (for URLs)', () => {
    assert.equal(
      formatPhoneNumber('01273800900', 'GB', 'RFC3966'),
      'tel:+441273800900'
    )

    assert.equal(
      formatPhoneNumber('02074504000', 'GB', 'RFC3966'),
      'tel:+442074504000'
    )

    assert.equal(
      formatPhoneNumber('0800890567', 'GB', 'RFC3966'),
      'tel:+44800890567'
    )

    assert.equal(
      formatPhoneNumber('07700900866', 'GB', 'RFC3966'),
      'tel:+447700900866'
    )
  })

  it('should not format non-numeric strings', () => {
    assert.equal(formatPhoneNumber('ABCDEFGH'), 'ABCDEFGH')
    assert.equal(formatPhoneNumber('!@£$%^&*()'), '!@£$%^&*()')
    assert.equal(formatPhoneNumber('!A@B£C$D%E'), '!A@B£C$D%E')
  })
})
