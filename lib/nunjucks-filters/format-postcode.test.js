import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatPostcode } from './format-postcode.js'

describe('formatPostcode', () => {
  it('should handle postcode formats with spaces', () => {
    assert.equal(formatPostcode('b1 1aa'), 'B1 1AA')
    assert.equal(formatPostcode('m60 2la'), 'M60 2LA')
    assert.equal(formatPostcode('sa6 7jl'), 'SA6 7JL')
    assert.equal(formatPostcode('so17 1bj'), 'SO17 1BJ')
    assert.equal(formatPostcode('w1d 1an'), 'W1D 1AN')
    assert.equal(formatPostcode('ec2r 8ah'), 'EC2R 8AH')
    assert.equal(formatPostcode('gir 0aa'), 'GIR 0AA')
  })

  it('should handle postcode formats with mixed spaces', () => {
    assert.equal(formatPostcode('m1  2sd'), 'M1 2SD') // Double space
    assert.equal(formatPostcode('ls12	1jk'), 'LS12 1JK') // Tab character
    assert.equal(formatPostcode('ab3 4fu'), 'AB3 4FU') // Non-breaking space
    assert.equal(formatPostcode('cv42 	  1bc'), 'CV42 1BC') // Mixed tabs and spaces
  })

  it('should handle postcode formats without spaces', () => {
    assert.equal(formatPostcode('b11aa'), 'B1 1AA')
    assert.equal(formatPostcode('m602la'), 'M60 2LA')
    assert.equal(formatPostcode('sa67jl'), 'SA6 7JL')
    assert.equal(formatPostcode('so171bj'), 'SO17 1BJ')
    assert.equal(formatPostcode('w1d1an'), 'W1D 1AN')
    assert.equal(formatPostcode('ec2r8ah'), 'EC2R 8AH')
    assert.equal(formatPostcode('gir0aa'), 'GIR 0AA')
  })

  it('should handle a lowercase postcode', () => {
    const inputIn = 'sw1a 0aa'
    const inputOut = 'SW1A 0AA'

    assert.equal(formatPostcode(inputIn), inputOut)
  })

  it('should handle a lowercase postcode (with untrimmed spaces)', () => {
    const inputIn = ' sw1a 0aa '
    const inputOut = 'SW1A 0AA'

    assert.equal(formatPostcode(inputIn), inputOut)
  })

  it('should handle a mixed case postcode', () => {
    const inputIn = 'Sw1a 0aA'
    const inputOut = 'SW1A 0AA'

    assert.equal(formatPostcode(inputIn), inputOut)
  })

  it('should handle a mixed case postcode (with untrimmed spaces)', () => {
    const inputIn = ' Sw1a 0aA '
    const inputOut = 'SW1A 0AA'

    assert.equal(formatPostcode(inputIn), inputOut)
  })

  it('should not handle a lowercase invalid postcode', () => {
    const input = 'sw1a 0'
    assert.equal(formatPostcode(input), input)
  })

  it('should not handle an uppercase invalid postcode', () => {
    const input = 'SW1A 0'
    assert.equal(formatPostcode(input), input)
  })

  it('should not handle a mixed case invalid postcode', () => {
    const input = 'sW1a 0'
    assert.equal(formatPostcode(input), input)
  })
})
