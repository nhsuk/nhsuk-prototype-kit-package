const { describe, it } = require('node:test')
const assert = require('node:assert')
const startsWith = require('../../lib/nunjucks-filters/starts-with')

describe('startsWith', () => {
  it('matches string', () => {
    assert.strictEqual(startsWith('NHS England', 'NHS'), true)
  })

  it('does not match string', () => {
    assert.strictEqual(startsWith('DHSC', 'NHS'), false)
  })
})
