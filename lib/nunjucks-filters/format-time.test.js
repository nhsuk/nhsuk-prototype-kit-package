import assert from 'node:assert/strict'
import { beforeEach, describe, it, mock } from 'node:test'

import { formatTime, formatTime24Hour } from './format-time.js'

describe('formatTime', () => {
  beforeEach(() => {
    mock.method(console, 'warn', () => {})
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
    assert.equal(formatTime('12:00', { truncate: false }), 'midday')
  })

  it('displays midnight instead of 00:00', () => {
    assert.equal(formatTime('00:00'), 'midnight')
    assert.equal(formatTime('00:00', { truncate: false }), 'midnight')
  })

  it('displays 12pm and 12am instead of midday and midnight if middayMidnight: false', () => {
    assert.equal(formatTime('12:00', { middayMidnight: false }), '12pm')
    assert.equal(formatTime('00:00', { middayMidnight: false }), '12am')
  })

  it('displays 12:00pm instead of midday if middayMidnight: false and truncate: false', () => {
    assert.equal(
      formatTime('12:00', { middayMidnight: false, truncate: false }),
      '12:00pm'
    )
  })

  it('drops the minutes for times on the hour', () => {
    assert.equal(formatTime('15:00'), '3pm')
  })

  it('keeps the minutes for times on the hour if truncate: false', () => {
    assert.equal(formatTime('14:00', { truncate: false }), '2:00pm')
    assert.equal(
      formatTime({ hour: '14', minute: '0' }, { truncate: false }),
      '2:00pm'
    )
  })

  it('displays an error if the time is invalid', () => {
    assert.equal(formatTime(''), 'Invalid time')
    assert.equal(formatTime(false), 'Invalid time')
    assert.equal(formatTime({ hour: 25, minute: 12 }), 'Invalid time')
    assert.equal(formatTime({ hour: 14, minute: 61 }), 'Invalid time')
    assert.equal(formatTime({ hour: Infinity, minute: null }), 'Invalid time')
    assert.equal(formatTime('25:12'), 'Invalid time')
    assert.equal(formatTime('14:61'), 'Invalid time')
  })
})

describe('formatTime24Hour', () => {
  beforeEach(() => {
    mock.method(console, 'warn', () => {})
  })

  it('formats time objects with string values using the 24 hour clock', () => {
    assert.equal(formatTime24Hour({ hour: '9', minute: '5' }), '09:05')
  })

  it('formats time objects with integer values using the 24 hour clock', () => {
    assert.equal(formatTime24Hour({ hour: 9, minute: 5 }), '09:05')
  })

  it('formats ISO 8601 date-times using the 24 hour clock', () => {
    assert.equal(formatTime24Hour('2026-08-08T09:05'), '09:05')
  })

  it('formats time strings using the 24 hour clock', () => {
    assert.equal(formatTime24Hour('09:05'), '09:05')
  })

  it('displays an error if the time is invalid', () => {
    assert.equal(formatTime24Hour(''), 'Invalid time')
    assert.equal(formatTime24Hour(false), 'Invalid time')
    assert.equal(formatTime24Hour({ hour: 25, minute: 12 }), 'Invalid time')
    assert.equal(formatTime24Hour({ hour: 14, minute: 61 }), 'Invalid time')
    assert.equal(formatTime24Hour('25:12'), 'Invalid time')
  })
})
