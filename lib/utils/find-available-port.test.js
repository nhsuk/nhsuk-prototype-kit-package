import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { findAvailablePort, getAvailablePort } from './find-available-port.js'

describe('findAvailablePort', () => {
  it('should default to port 3000', async () => {
    const port = await findAvailablePort()
    assert.equal(port, 3000)
  })

  it('should return the start port when it is available', async () => {
    const port = await findAvailablePort(3002)
    assert.equal(port, 3002)
  })
})

describe('getAvailablePort', () => {
  it('should avoid port 6000 as this can be blocked by browsers', async () => {
    const port = await getAvailablePort(6000)
    assert.notEqual(port, 6000)
  })

  it('should not return start port below the allowed range', async () => {
    const port = await getAvailablePort(80)
    assert.equal(port, 2000) // Nearest 1000 above 1024
  })

  it('should not return start port above the allowed range', async () => {
    const port = await getAvailablePort(50000)
    assert.equal(port, 49000) // Nearest 1000 below 49151
  })
})
