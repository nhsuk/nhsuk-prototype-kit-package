import { utils } from 'nhsuk-prototype-kit'

/**
 * Service name
 */
export const serviceName = 'Test service'

/**
 * Session name
 */
export const sessionName = utils.getSessionName(serviceName)
