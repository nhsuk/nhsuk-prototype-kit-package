import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'

import { formatTime, formatTime24Hour } from './format-time.js'

describe('formatTime', () => {
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

  it('formats time objects with string values to a time using the NHS.UK style', () => {
    assert.equal(formatTime({ hour: '14', minute: '15' }), '2:15pm')
  })

  it('formats time objects with integer values to a time using the NHS.UK style', () => {
    assert.equal(formatTime({ hour: 14, minute: 15 }), '2:15pm')
  })

  it('formats ISO 8601 date-times to a time using the NHS.UK style', () => {
    assert.equal(formatTime('2026-08-08T14:15'), '2:15pm')
  })

  it('drops seconds from ISO 8601 date-times', () => {
    assert.equal(formatTime('2026-08-08T14:15:55'), '2:15pm')
  })

  it('formats time strings to a time using the NHS.UK style', () => {
    assert.equal(formatTime('14:15'), '2:15pm')
  })

  it('displays midday instead of 12:00pm', () => {
    assert.equal(formatTime('12:00'), 'midday')
    assert.equal(
      formatTime('12:00', { includeMinutesOnTheHour: true }),
      'midday'
    )
  })

  it('displays midnight instead of 00:00', () => {
    assert.equal(formatTime('00:00'), 'midnight')
    assert.equal(
      formatTime('00:00', { includeMinutesOnTheHour: true }),
      'midnight'
    )
  })

  it('displays 12pm and 12am instead of midday and midnight if useMiddayMidnight: false', () => {
    assert.equal(formatTime('12:00', { useMiddayMidnight: false }), '12pm')
    assert.equal(formatTime('00:00', { useMiddayMidnight: false }), '12am')
  })

  it('displays 12:00pm instead of midday if useMiddayMidnight: false and includeMinutesOnTheHour: true', () => {
    assert.equal(
      formatTime('12:00', {
        useMiddayMidnight: false,
        includeMinutesOnTheHour: true
      }),
      '12:00pm'
    )
  })

  it('displays 12:00am instead of midnight if useMiddayMidnight: false and includeMinutesOnTheHour: true', () => {
    assert.equal(
      formatTime('00:00', {
        useMiddayMidnight: false,
        includeMinutesOnTheHour: true
      }),
      '12:00am'
    )
  })

  it('drops the minutes for times on the hour', () => {
    assert.equal(formatTime('15:00'), '3pm')
  })

  it('keeps the minutes for times on the hour if includeMinutesOnTheHour: true', () => {
    assert.equal(
      formatTime('14:00', { includeMinutesOnTheHour: true }),
      '2:00pm'
    )
    assert.equal(
      formatTime(
        { hour: '14', minute: '0' },
        { includeMinutesOnTheHour: true }
      ),
      '2:00pm'
    )
  })

  it('converts times with a timezone offset to local time (default: Europe/London)', () => {
    // UTC during BST (summer) → London is UTC+1
    assert.equal(formatTime('2026-08-08T14:15Z'), '3:15pm')
    // +05:30 during BST → 14:15 - 05:30 = 08:45 UTC → 09:45 London
    assert.equal(formatTime('2026-08-08T14:15+05:30'), '9:45am')
    // -05:00 during BST → 02:00 + 05:00 = 07:00 UTC → 08:00 London
    assert.equal(formatTime('2026-08-08T02:00-05:00'), '8am')
    // UTC during GMT (winter) → London is UTC+0
    assert.equal(formatTime('2026-12-08T14:15Z'), '2:15pm')
    // +05:30 during GMT → 14:15 - 05:30 = 08:45 UTC → 08:45 London
    assert.equal(formatTime('2026-12-08T14:15+05:30'), '8:45am')
  })

  it('converts times with a timezone offset using process.env.TZ', () => {
    process.env.TZ = 'America/New_York'

    // UTC during EDT (summer) → New York is UTC-4
    assert.equal(formatTime('2026-08-08T14:15Z'), '10:15am')
    // +05:30 during EDT → 14:15 - 05:30 = 08:45 UTC → 04:45 New York
    assert.equal(formatTime('2026-08-08T14:15+05:30'), '4:45am')
    // UTC during EST (winter) → New York is UTC-5
    assert.equal(formatTime('2026-12-08T14:15Z'), '9:15am')
  })

  it('falls back to Europe/London if process.env.TZ is invalid', () => {
    process.env.TZ = 'Not/A/Timezone'

    assert.equal(formatTime('2026-08-08T14:15Z'), '3:15pm')
  })

  it('converts to a specific timezone using the zone option', () => {
    // UTC during EDT (summer) → New York is UTC-4
    assert.equal(
      formatTime('2026-08-08T14:15Z', { zone: 'America/New_York' }),
      '10:15am'
    )
    // UTC during JST → Tokyo is UTC+9
    assert.equal(
      formatTime('2026-08-08T14:15Z', { zone: 'Asia/Tokyo' }),
      '11:15pm'
    )
    // UTC during CET (winter) → Paris is UTC+1
    assert.equal(
      formatTime('2026-12-08T14:15Z', { zone: 'Europe/Paris' }),
      '3:15pm'
    )
  })

  it('zone option overrides process.env.TZ', () => {
    process.env.TZ = 'America/New_York'

    assert.equal(
      formatTime('2026-08-08T14:15Z', { zone: 'Asia/Tokyo' }),
      '11:15pm'
    )
  })

  it('displays an error if the time is invalid', () => {
    assert.equal(formatTime(''), 'Invalid time')
    assert.equal(formatTime(false), 'Invalid time')
    assert.equal(formatTime({ hour: 25, minute: 12 }), 'Invalid time')
    assert.equal(formatTime({ hour: 14, minute: 61 }), 'Invalid time')
    assert.equal(formatTime({ hour: Infinity, minute: null }), 'Invalid time')
    assert.equal(formatTime({ hour: '', minute: '' }), 'Invalid time')
    assert.equal(formatTime({ hour: ' ', minute: ' ' }), 'Invalid time')
    assert.equal(formatTime('25:12'), 'Invalid time')
    assert.equal(formatTime('14:61'), 'Invalid time')
  })

  it('formats time objects with string values using the 24 hour clock', () => {
    assert.equal(
      formatTime({ hour: '9', minute: '5' }, { use24hour: true }),
      '09:05'
    )
  })

  it('formats time objects with integer values using the 24 hour clock', () => {
    assert.equal(
      formatTime({ hour: 9, minute: 5 }, { use24hour: true }),
      '09:05'
    )
  })

  it('formats ISO 8601 date-times using the 24 hour clock', () => {
    assert.equal(formatTime('2026-08-08T09:05', { use24hour: true }), '09:05')
  })

  it('formats time strings using the 24 hour clock', () => {
    assert.equal(formatTime('09:05', { use24hour: true }), '09:05')
  })

  it('formats 12 hour clock time strings using the 24 hour clock', () => {
    assert.equal(formatTime('2:15pm', { use24hour: true }), '14:15')
    assert.equal(formatTime('11:30 AM', { use24hour: true }), '11:30')
  })

  it('displays 12:00 and 00:00 rather than midday and midnight using the 24 hour clock, even if useMiddayMidnight is true', () => {
    assert.equal(formatTime('12:00', { use24hour: true }), '12:00')
    assert.equal(
      formatTime('12:00', { use24hour: true, useMiddayMidnight: true }),
      '12:00'
    )
    assert.equal(
      formatTime('00:00', { use24hour: true, useMiddayMidnight: true }),
      '00:00'
    )
  })

  it('always shows minutes as 2 digits using the 24 hour clock, even if includeMinutesOnTheHour is false', () => {
    assert.equal(
      formatTime('09:00', { use24hour: true, includeMinutesOnTheHour: false }),
      '09:00'
    )
    assert.equal(
      formatTime('09:00', { use24hour: true, includeMinutesOnTheHour: true }),
      '09:00'
    )
  })

  it('displays an error if the time is invalid using the 24 hour clock', () => {
    assert.equal(formatTime('', { use24hour: true }), 'Invalid time')
    assert.equal(formatTime(false, { use24hour: true }), 'Invalid time')
    assert.equal(
      formatTime({ hour: 25, minute: 12 }, { use24hour: true }),
      'Invalid time'
    )
    assert.equal(
      formatTime({ hour: 14, minute: 61 }, { use24hour: true }),
      'Invalid time'
    )
    assert.equal(
      formatTime({ hour: '', minute: '' }, { use24hour: true }),
      'Invalid time'
    )
    assert.equal(
      formatTime({ hour: ' ', minute: ' ' }, { use24hour: true }),
      'Invalid time'
    )
    assert.equal(formatTime('25:12', { use24hour: true }), 'Invalid time')
  })
})

describe('formatTime24Hour', () => {
  it('is an alias for formatTime with the use24hour option', () => {
    assert.equal(formatTime24Hour('2:15pm'), '14:15')
  })
})
