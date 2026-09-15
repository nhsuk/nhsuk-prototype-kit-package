import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { parseInteger } from './parse-integer.js'

describe('parseInteger', () => {
  it('parses non-negative integer strings', () => {
    assert.equal(parseInteger('1'), 1)
    assert.equal(parseInteger('22'), 22)
    assert.equal(parseInteger('333'), 333)
    assert.equal(parseInteger('4444'), 4444)

    assert.equal(parseInteger('0001'), 1)
    assert.equal(parseInteger('0022'), 22)
    assert.equal(parseInteger('0333'), 333)
    assert.equal(parseInteger('4444'), 4444)
  })

  it('returns non-negative integers', () => {
    assert.equal(parseInteger(1), 1)
    assert.equal(parseInteger(22), 22)
    assert.equal(parseInteger(333), 333)
    assert.equal(parseInteger(4444), 4444)
  })

  it('throws on negative integer strings', () => {
    assert.throws(() => parseInteger('-1'), RangeError)
    assert.throws(() => parseInteger('-22'), RangeError)
    assert.throws(() => parseInteger('-333'), RangeError)
    assert.throws(() => parseInteger('-4444'), RangeError)
  })

  it('throws on negative integers', () => {
    assert.throws(() => parseInteger(-1), RangeError)
    assert.throws(() => parseInteger(-22), RangeError)
    assert.throws(() => parseInteger(-333), RangeError)
    assert.throws(() => parseInteger(-4444), RangeError)
  })

  it('throws on non-absolute numbers', () => {
    assert.throws(() => parseInteger(NaN), RangeError)
    assert.throws(() => parseInteger(Infinity), RangeError)
    assert.throws(() => parseInteger(-Infinity), RangeError)
  })

  it('throws on invalid input', () => {
    assert.throws(() => parseInteger('2.5'), RangeError)
    assert.throws(() => parseInteger('1e3'), RangeError)
    assert.throws(() => parseInteger('abc'), RangeError)
    assert.throws(() => parseInteger(''), RangeError)
    assert.throws(() => parseInteger(null), RangeError)
    assert.throws(() => parseInteger(undefined), RangeError)
    assert.throws(() => parseInteger('  '), RangeError)
    assert.throws(() => parseInteger(), RangeError)
    assert.throws(() => parseInteger([]), RangeError)
    assert.throws(() => parseInteger({}), RangeError)
  })
})
