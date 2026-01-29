/**
 * Say hi filter
 *
 * Which in your templates would be used as:
 *
 * @example 'Hi Gemma!'
 * ```njk
 * {{ 'Gemma' | sayHi }}
 * ```
 *
 * Notice the first argument of your filters method is whatever
 * gets 'piped' via '|' to the filter.
 *
 * Filters can take additional arguments:
 * @example 'Greetings Joel!'
 * ```njk
 * {{ 'Joel' | sayHi('formal') }}
 * ```
 * @tutorial Learn how to write {@link https://prototype-kit.service-manual.nhs.uk/guides/filters/ | Nunjucks filters}
 * @param {string} name
 * @param {'formal' | 'informal'} tone
 */
export function sayHi(name, tone) {
  return `${tone == 'formal' ? 'Greetings' : 'Hi'} ${name}!`
}
