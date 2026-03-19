import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { findAvailablePort, getAvailablePort } from './find-available-port.js'

describe('findAvailablePort', () => {
  it('should return the start port when it is available', async () => {
    // Use a high port that's unlikely to be in use
    const port = await findAvailablePort(49000)
    assert.equal(port, 49000)
  })

  it('should default to port 3000', async () => {
    const port = await findAvailablePort()
    assert.equal(port, 3000)
  })
})

describe('getAvailablePort', () => {
  it('should avoid port 6000 as this can be blocked by browsers', async () => {
    const port = await getAvailablePort(6000)
    assert.notEqual(port, 6000)
  })
})
