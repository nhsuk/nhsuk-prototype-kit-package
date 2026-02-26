import { pageListing } from './page-listing.js'

/**
 * @param {Environment} nunjucksEnv
 */
export function addAll(nunjucksEnv) {
  nunjucksEnv.addGlobal('pageListing', pageListing)

  return nunjucksEnv
}

export { pageListing }

/**
 * @import { Environment } from 'nunjucks'
 */
