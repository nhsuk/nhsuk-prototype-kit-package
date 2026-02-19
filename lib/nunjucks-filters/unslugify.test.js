import assert from 'node:assert'
import { describe, it } from 'node:test'

import { unslugify } from './unslugify.js'

describe('unslugify', () => {
  it('should format slug into readable string', () => {
    assert.equal(unslugify('hello'), 'Hello')
    assert.equal(unslugify('hello-world'), 'Hello world')
  })

  it('handles number input', () => {
    assert.equal(unslugify(1000000000), '1000000000')
    assert.equal(unslugify(9991234567), '9991234567')
  })

  it('handles undefined', () => {
    assert.equal(unslugify(), '')
    assert.equal(unslugify(undefined), '')
  })
})
