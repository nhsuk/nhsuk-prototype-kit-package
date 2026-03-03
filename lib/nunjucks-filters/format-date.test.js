import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatDate } from './format-date.js'

describe('formatDate', () => {
  it('Formats date objects with string values to a date using the NHS.UK style', () => {
    assert.equal(
      formatDate({ year: '2021', month: '08', day: '7 ' }),
      '7 August 2021'
    )
  })

  it('Formats date objects with integer values to a date using the NHS.UK style', () => {
    assert.equal(formatDate({ year: 2021, month: 8, day: 7 }), '7 August 2021')
  })

  it('Formats ISO 8601 dates to a date using the NHS.UK style', () => {
    assert.equal(formatDate('2021-08-07T12:00:00'), '7 August 2021')
    assert.equal(formatDate('2021-08-07'), '7 August 2021')
  })

  it('Include day of week if showWeekday: true', () => {
    assert.equal(
      formatDate({ year: '2026', month: '3', day: '3' }, { showWeekday: true }),
      'Tuesday 3 March 2026'
    )
  })

  it('Truncate month and day names if truncate: true', () => {
    assert.equal(
      formatDate({ year: '2026', month: '3', day: '3' }, { truncate: true }),
      '3 Mar 2026'
    )

    assert.equal(
      formatDate(
        { year: '2026', month: '3', day: '3' },
        { truncate: true, showWeekday: true }
      ),
      'Tue 3 Mar 2026'
    )
  })

  it('Displays an error if the date is invalid', () => {
    assert.equal(formatDate(''), 'Invalid date')
    assert.equal(formatDate(false), 'Invalid date')
    assert.equal(formatDate({ year: 2026, month: 13, day: 1 }), 'Invalid date')
  })
})
