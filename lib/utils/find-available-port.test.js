import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { getSuggestedPorts } from './find-available-port.js'

describe('getSuggestedPorts', () => {
  it('should suggest default ports', () => {
    const ports = getSuggestedPorts()
    assert.deepEqual(ports, [3000, 4000, 5000, 7000, 8000, 9000])
  })

  it('should suggest custom ports from given start port', () => {
    const ports = getSuggestedPorts(3002)
    assert.deepEqual(ports, [3002, 4002, 5002, 6002, 7002, 8002, 9002])
  })

  it('should not suggest port 6000', () => {
    assert.ok(!getSuggestedPorts(6000).includes(6000))
  })
})
