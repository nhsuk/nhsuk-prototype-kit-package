import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { getSessionName } from './get-session-name.js'

describe('getSessionName', () => {
  it('should generate a unique session name', () => {
    assert.equal(
      getSessionName('Test service'),
      'nhsuk-prototype-kit-546573742073657276696365'
    )
  })
})
