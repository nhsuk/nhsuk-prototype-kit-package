import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatPhoneNumber } from './format-phone-number.js'

// Formats from https://service-manual.nhs.uk/content/a-to-z-of-nhs-health-writing#phone-and-phone-numbers
describe('formatPhoneNumber', () => {
  it('should format a phone number with a 5 digit area code', () => {
    assert.equal(formatPhoneNumber('01273800900'), '01273 800 900')
    assert.equal(formatPhoneNumber('01273 800900'), '01273 800 900')
    assert.equal(formatPhoneNumber('012 7380 0900'), '01273 800 900')
  })

  it('should format a phone number with a 4 digit area code', () => {
    assert.equal(formatPhoneNumber('01134960000'), '0113 496 0000')
    assert.equal(formatPhoneNumber('01134 960000'), '0113 496 0000')
    assert.equal(formatPhoneNumber('01214960123'), '0121 496 0123')
    assert.equal(formatPhoneNumber('0161 4960 999'), '0161 496 0999')
  })

  it('should format a London number with 3 digit area code', () => {
    assert.equal(formatPhoneNumber('02074504000'), '020 7450 4000')
    assert.equal(formatPhoneNumber('0207 450 4000'), '020 7450 4000')
  })

  it('should format a freephone number', () => {
    assert.equal(formatPhoneNumber('0800890567'), '0800 890 567')
    assert.equal(formatPhoneNumber('0800 890567'), '0800 890 567')
  })

  it('should format a mobile number', () => {
    assert.equal(formatPhoneNumber('07700 900123'), '07700 900 123')
  })

  it('should format a UK number with an international dialling code', () => {
    assert.equal(formatPhoneNumber('+442074504000'), '+44 (0)20 7450 4000')
    assert.equal(formatPhoneNumber('+44 20 7450 4000'), '+44 (0)20 7450 4000')
    assert.equal(
      formatPhoneNumber('+44 (0)20 7450 4000'),
      '+44 (0)20 7450 4000'
    )
    assert.equal(formatPhoneNumber('+447700900123'), '+44 (0)7700 900 123')
    assert.equal(formatPhoneNumber('+441273800900'), '+44 (0)1273 800 900')
  })

  it('should format French numbers with a single digit and then groups of 2', () => {
    assert.equal(formatPhoneNumber('+33123456789'), '+33 1 23 45 67 89')
  })

  it('should format US numbers with a 3 digit area code, then a 3 digit group and a 4 digit group', () => {
    assert.equal(formatPhoneNumber('+12125550123'), '+1 212 555 0123')
    assert.equal(formatPhoneNumber('+1 (212) 555-0123'), '+1 212 555 0123')
  })

  it('should format Irish mobile numbers with a 2 digit prefix, 3 digit group and 4 digit group', () => {
    assert.equal(formatPhoneNumber('+353-85-123-4567'), '+353 85 123 4567')
  })

  it('should format Australian landline numbers with a 1 digit area code and two 4 digit groups', () => {
    assert.equal(formatPhoneNumber('+61298765432'), '+61 2 9876 5432')
  })

  it('should format a memorable 6 digit number', () => {
    assert.equal(formatPhoneNumber(' 116123 '), '116 123')
  })

  it('should format numbers with inconsistent spacing', () => {
    assert.equal(formatPhoneNumber(' 01273 800900 '), '01273 800 900')
    assert.equal(formatPhoneNumber('0207 450 4000'), '020 7450 4000')
    assert.equal(formatPhoneNumber('077009 00866'), '07700 900 866')
  })

  it('should remove any hyphens or brackets', () => {
    assert.equal(formatPhoneNumber('020-7450-4000'), '020 7450 4000')
    assert.equal(formatPhoneNumber('(01273) 800900'), '01273 800 900')
  })

  it('should not alter numbers with missing leading zero', () => {
    assert.equal(formatPhoneNumber('2074504000'), '2074504000')
  })

  it('should not alter a 3 digit emergency number like 999', () => {
    assert.equal(formatPhoneNumber('999'), '999')
  })

  it('should not alter anything that is not recognised as a phone number', () => {
    assert.equal(formatPhoneNumber('12345'), '12345')
    assert.equal(formatPhoneNumber('ABCD'), 'ABCD')
    assert.equal(formatPhoneNumber('Call 07700900866'), 'Call 07700900866')
    assert.equal(formatPhoneNumber(undefined), undefined)
    assert.equal(formatPhoneNumber(null), null)
    assert.equal(formatPhoneNumber(-10), -10)
  })
})
