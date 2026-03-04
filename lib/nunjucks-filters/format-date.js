/**
 * Format a date whilst following the NHS.UK style guide for dates
 *
 * The input can be day, month and year numbers entered by a user into
 * the Date input component, which the prototype kit converts into an object.
 *
 * Alternatively the filter also works with ISO date strings like `2026-03-03`.
 *
 * If needed, you can include the day of the week by adding showWeekday: true option.
 * You can also truncate the month names (and weekday names if included) by using the
 * truncate: true option.
 *
 * @example
 * ```njk
 * {{ data.dateOfBirth | formatDate }}
 * ```
 * @example
 * ```njk
 * {{ data.appointmentDate | formatDate({ showWeekday: true }) }}
 * ```
 * @see {@link https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#dates}
 * @param {string|object} input - Date
 * @param {object} [kwargs] - Keyword arguments
 * @param {boolean} [kwargs.showWeekday] - Show day of the week
 * @param {boolean} [kwargs.truncate] - Truncate month name
 * @returns {string} `string` as a human readable date
 */
export function formatDate(input, kwargs) {
  let date

  const isoDateFormat = /^\d{4}-\d{2}-\d{2}$/

  const options = {
    showWeekday: false,
    truncate: false,
    ...kwargs
  }

  try {
    if (input.year && input.month && input.day) {
      // JavaScript date function expects a month which is 0-indexed
      const monthIndex = parseInt(input.month, 10) - 1

      if (monthIndex >= 12 || monthIndex < 0) {
        throw RangeError
      }

      date = new Date(input.year, monthIndex, input.day)
    } else if (input.match(isoDateFormat)) {
      date = new Date(input)
    } else {
      throw RangeError
    }

    const weekdayFormat = new Intl.DateTimeFormat('en-GB', {
      weekday: options.truncate ? 'short' : 'long'
    })

    const dateFormat = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: options.truncate ? 'short' : 'long',
      day: 'numeric'
    })

    let formatted = ''

    // The weekday is manually prefixed to the formatted date,
    // as the Intl.DateTimeFormat combined option will insert a comma,
    // which we don’t want.
    if (options.showWeekday) {
      formatted += `${weekdayFormat.format(date)} `
    }

    formatted += dateFormat.format(date)

    return formatted
  } catch {
    return 'Invalid date'
  }
}
