import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'

import { formatDate } from './format-date.js'

describe('formatDate', () => {
  const originalTZ = process.env.TZ

  beforeEach(() => {
    mock.method(console, 'warn', () => {})
  })

  afterEach(() => {
    if (originalTZ === undefined) {
      delete process.env.TZ
    } else {
      process.env.TZ = originalTZ
    }
  })

  it('formats date objects with string values to a date using the NHS.UK style', () => {
    assert.equal(
      formatDate({ year: '2021', month: '08', day: '7 ' }),
      '7 August 2021'
    )
  })

  it('formats date objects with integer values to a date using the NHS.UK style', () => {
    assert.equal(formatDate({ year: 2021, month: 8, day: 7 }), '7 August 2021')
  })

  it('formats ISO 8601 dates to a date using the NHS.UK style', () => {
    assert.equal(formatDate('2021-08-07'), '7 August 2021')
  })

  it('includes day of week if includeDayOfWeek: true', () => {
    assert.equal(
      formatDate(
        { year: '2026', month: '3', day: '3' },
        { includeDayOfWeek: true }
      ),
      'Tuesday 3 March 2026'
    )
  })

  it('displays an error if the date is invalid', () => {
    assert.equal(formatDate(''), 'Invalid date')
    assert.equal(formatDate(false), 'Invalid date')
    assert.equal(formatDate({ year: 2026, month: 13, day: 1 }), 'Invalid date')
    assert.equal(formatDate({ year: '', month: 8, day: 1 }), 'Invalid date')
    assert.equal(
      formatDate({ year: Infinity, month: null, day: false }),
      'Invalid date'
    )
    assert.equal(formatDate('2026-13-01'), 'Invalid date')
    assert.equal(formatDate({ year: 2026, month: 2, day: 31 }), 'Invalid date')
    assert.equal(formatDate('2026-02-31'), 'Invalid date')
  })

  it('returns just the date part if the ISO date string contains a time', () => {
    assert.equal(formatDate('2026-01-01T02:35'), '1 January 2026')
    assert.equal(formatDate('2026-01-01T02:35:21'), '1 January 2026')
  })

  it('converts to local date when the ISO string contains a timezone offset (default: Europe/London)', () => {
    // UTC just after midnight in summer (BST) → still same day in London
    assert.equal(formatDate('2026-08-01T00:30Z'), '1 August 2026')
    // UTC just before midnight in summer → next day in London (UTC+1)
    assert.equal(formatDate('2026-07-31T23:30Z'), '1 August 2026')
    // UTC in winter (GMT) → same day in London
    assert.equal(formatDate('2026-01-01T02:35Z'), '1 January 2026')
    // +05:30 late at night → earlier UTC → previous day in London
    assert.equal(formatDate('2026-01-01T02:35+05:30'), '31 December 2025')
  })

  it('converts to local date using process.env.TZ', () => {
    process.env.TZ = 'Pacific/Auckland'

    // UTC in August → Auckland is UTC+12 (NZST)
    assert.equal(formatDate('2026-08-15T20:00Z'), '16 August 2026')
  })

  it('converts to a specific timezone using the zone option', () => {
    assert.equal(
      formatDate('2026-08-01T03:00Z', { zone: 'America/New_York' }),
      '31 July 2026'
    )
    assert.equal(
      formatDate('2026-08-01T03:00Z', { zone: 'Asia/Tokyo' }),
      '1 August 2026'
    )
  })

  it('zone option overrides process.env.TZ', () => {
    process.env.TZ = 'America/New_York'

    assert.equal(
      formatDate('2026-08-01T03:00Z', { zone: 'Asia/Tokyo' }),
      '1 August 2026'
    )
  })
})
