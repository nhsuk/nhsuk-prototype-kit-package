import { utils } from 'nhsuk-prototype-kit'

/**
 * Service name
 */
export const serviceName = 'Test service'

/**
 * Session name
 */
export const sessionName = utils.getSessionName(serviceName)

/**
 * Session max age (milliseconds)
 */
export const sessionMaxAge = 1000 * 60 * 60 * 4 // 4 hours
