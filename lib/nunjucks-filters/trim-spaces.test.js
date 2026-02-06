import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { trimSpaces } from './trim-spaces.js'

describe('trimSpaces', () => {
  it('trims string', () => {
    assert.equal(trimSpaces(' 999 123 4567  '), '9991234567')
  })

  it('trims multiple spaces', () => {
    assert.equal(trimSpaces(' 999   123 4567  '), '9991234567')
  })

  it('handles number input', () => {
    assert.equal(trimSpaces(9991234567), '9991234567')
  })
})
