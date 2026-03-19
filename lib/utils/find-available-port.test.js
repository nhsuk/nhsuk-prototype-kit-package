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

  it('should suggest custom ports from given start port (up to maximum)', () => {
    const ports = getSuggestedPorts(47000)
    assert.deepEqual(ports, [47000, 48000, 49000])
  })

  it('should not suggest port 6000', () => {
    assert.ok(!getSuggestedPorts(6000).includes(6000))
  })

  it('should clamp custom ports to allowed range', () => {
    const ports1 = getSuggestedPorts(80) // Below 1024
    const ports2 = getSuggestedPorts(50000) // Above 49151

    // Nearest 1000 above 1024
    assert.deepEqual(ports1, [2000, 3000, 4000, 5000, 7000, 8000])

    // Nearest 1000 below 49151
    assert.deepEqual(ports2, [49000])
  })
})
