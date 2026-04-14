import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatCurrency } from './format-currency.js'

describe('formatCurrency', () => {
  it('should format numbers', () => {
    assert.equal(formatCurrency(300), '£300')
    assert.equal(formatCurrency(300.5), '£300.50')
    assert.equal(formatCurrency(300.59), '£300.59')
    assert.equal(formatCurrency(300.591), '£300.59')
    assert.equal(formatCurrency(300.599), '£300.60')
  })

  it('should format negative numbers', () => {
    assert.equal(formatCurrency(-300), '-£300')
    assert.equal(formatCurrency(-300.5), '-£300.50')
    assert.equal(formatCurrency(-300.59), '-£300.59')
    assert.equal(formatCurrency(-300.591), '-£300.59')
    assert.equal(formatCurrency(-300.599), '-£300.60')
  })

  it('should format numeric strings', () => {
    // Hundreds
    assert.equal(formatCurrency('300'), '£300')
    assert.equal(formatCurrency('300.0'), '£300')
    assert.equal(formatCurrency('300.00'), '£300')
    assert.equal(formatCurrency('300.5'), '£300.50')
    assert.equal(formatCurrency('300.50'), '£300.50')
    assert.equal(formatCurrency('300.59'), '£300.59')
    assert.equal(formatCurrency('300.591'), '£300.59')
    assert.equal(formatCurrency('300.599'), '£300.60')

    // Thousands
    assert.equal(formatCurrency('3000'), '£3,000')
    assert.equal(formatCurrency('3000.0'), '£3,000')
    assert.equal(formatCurrency('3000.00'), '£3,000')
    assert.equal(formatCurrency('3000.5'), '£3,000.50')
    assert.equal(formatCurrency('3000.50'), '£3,000.50')
    assert.equal(formatCurrency('3000.59'), '£3,000.59')
    assert.equal(formatCurrency('3000.591'), '£3,000.59')
    assert.equal(formatCurrency('3000.599'), '£3,000.60')

    // 10s of thousands
    assert.equal(formatCurrency('30000'), '£30,000')
    assert.equal(formatCurrency('30000.0'), '£30,000')
    assert.equal(formatCurrency('30000.00'), '£30,000')
    assert.equal(formatCurrency('30000.5'), '£30,000.50')
    assert.equal(formatCurrency('30000.50'), '£30,000.50')
    assert.equal(formatCurrency('30000.59'), '£30,000.59')
    assert.equal(formatCurrency('30000.591'), '£30,000.59')
    assert.equal(formatCurrency('30000.599'), '£30,000.60')

    // 100s of thousands
    assert.equal(formatCurrency('300000'), '£300,000')
    assert.equal(formatCurrency('300000.0'), '£300,000')
    assert.equal(formatCurrency('300000.00'), '£300,000')
    assert.equal(formatCurrency('300000.5'), '£300,000.50')
    assert.equal(formatCurrency('300000.50'), '£300,000.50')
    assert.equal(formatCurrency('300000.59'), '£300,000.59')
    assert.equal(formatCurrency('300000.591'), '£300,000.59')
    assert.equal(formatCurrency('300000.599'), '£300,000.60')

    // Millions
    assert.equal(formatCurrency('3000000'), '£3,000,000')
    assert.equal(formatCurrency('3000000.0'), '£3,000,000')
    assert.equal(formatCurrency('3000000.00'), '£3,000,000')
    assert.equal(formatCurrency('3000000.5'), '£3,000,000.50')
    assert.equal(formatCurrency('3000000.50'), '£3,000,000.50')
    assert.equal(formatCurrency('3000000.59'), '£3,000,000.59')
    assert.equal(formatCurrency('3000000.591'), '£3,000,000.59')
    assert.equal(formatCurrency('3000000.599'), '£3,000,000.60')
  })

  it('should format numeric strings (badly formatted)', () => {
    assert.equal(formatCurrency('3,00,0,0'), '£30,000')
    assert.equal(formatCurrency('3,00,0,0.50'), '£30,000.50')
    assert.equal(formatCurrency('3,00,0,0.51'), '£30,000.51')
    assert.equal(formatCurrency('3,00,0,0.512'), '£30,000.51')
    assert.equal(formatCurrency('3,00,0,0.519'), '£30,000.52')
    assert.equal(formatCurrency('3,0,0,0,0.50'), '£30,000.50')
    assert.equal(formatCurrency('3,0,0,0,0.51'), '£30,000.51')
    assert.equal(formatCurrency('3,0,0,0,0.512'), '£30,000.51')
    assert.equal(formatCurrency('3,0,0,0,0.519'), '£30,000.52')
  })

  it('should format numeric strings (accidental spaces)', () => {
    assert.equal(formatCurrency('3 ,00,0,0 '), '£30,000')
    assert.equal(formatCurrency('3,00,0,0 .50'), '£30,000.50')
    assert.equal(formatCurrency('3, 00,0,0 .51'), '£30,000.51')
    assert.equal(formatCurrency('3,00,0,0  .512'), '£30,000.51')
    assert.equal(formatCurrency('3,0 0,0,0 .519'), '£30,000.52')
    assert.equal(formatCurrency('3,0,0, 0,0.50'), '£30,000.50')
    assert.equal(formatCurrency('3, 0,0,0,0 .51'), '£30,000.51')
    assert.equal(formatCurrency('3,0,0,0,0  .512'), '£30,000.51')
    assert.equal(formatCurrency('3,0, 0,0,0 .519'), '£30,000.52')
  })

  it('should format numeric strings (with symbols)', () => {
    assert.equal(formatCurrency('£3,00,0,0'), '£30,000')
    assert.equal(formatCurrency('£3,00,0,0.50'), '£30,000.50')
    assert.equal(formatCurrency('£3,00,0,0.51'), '£30,000.51')
    assert.equal(formatCurrency('£3,00,0,0.512'), '£30,000.51')
    assert.equal(formatCurrency('£3,00,0,0.519'), '£30,000.52')
    assert.equal(formatCurrency('£3,0,0,0,0.50'), '£30,000.50')
    assert.equal(formatCurrency('£3,0,0,0,0.51'), '£30,000.51')
    assert.equal(formatCurrency('£3,0,0,0,0.512'), '£30,000.51')
    assert.equal(formatCurrency('£3,0,0,0,0.519'), '£30,000.52')
  })

  it('should format numeric strings (total mess)', () => {
    assert.equal(formatCurrency('£3,00,,,0,0 ...512'), '£30,000.51')
    assert.equal(formatCurrency('£3,0 0,0,0 .519$%'), '£30,000.52')
    assert.equal(formatCurrency('£3,0,0, 0,0.50AA'), '£30,000.50')
    assert.equal(formatCurrency('%3, 0,0,0,0 .51C'), '£30,000.51')
    assert.equal(formatCurrency('$3,0, 0,0,0 .519'), '£30,000.52')
  })

  it('should not format non-numeric strings', () => {
    assert.equal(formatCurrency('ABCDEFGH'), 'ABCDEFGH')
    assert.equal(formatCurrency('!@£$%^&*()'), '!@£$%^&*()')
    assert.equal(formatCurrency('!A@B£C$D%E'), '!A@B£C$D%E')
  })
})
