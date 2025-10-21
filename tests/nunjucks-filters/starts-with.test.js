const startsWith = require('../../lib/nunjucks-filters/starts-with')

test('startsWith matches string', () => {
  expect(startsWith('NHS England', 'NHS')).toBe(true)
})

test('startsWith does not match string', () => {
  expect(startsWith('DHSC', 'NHS')).toBe(false)
})
