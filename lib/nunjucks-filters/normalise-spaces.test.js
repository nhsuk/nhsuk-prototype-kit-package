import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { normaliseSpaces } from './normalise-spaces.js'

describe('normaliseSpaces', () => {
  it('trims string', () => {
    assert.equal(normaliseSpaces(' NHS   England  '), 'NHS England')
  })

  it('collapses multiple spaces', () => {
    assert.equal(normaliseSpaces(' NHS   England  '), 'NHS England')
  })

  it('preserves single spaces', () => {
    assert.equal(normaliseSpaces(' NHS England '), 'NHS England')
    assert.equal(normaliseSpaces('NHS England'), 'NHS England')
  })

  it('handles number input', () => {
    assert.equal(normaliseSpaces(9991234567), '9991234567')
  })
})
