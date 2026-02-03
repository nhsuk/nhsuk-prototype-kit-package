/**
 * Add Nunjucks filters to environment
 *
 * @param {Environment} nunjucksEnv - Nunjucks environment
 * @param {NunjucksFilters | ((env: Environment) => NunjucksFilters)} nunjucksFilters - Nunjucks filters to add
 */
export function addNunjucksFilters(nunjucksEnv, nunjucksFilters) {
  if (typeof nunjucksFilters === 'function') {
    nunjucksFilters = nunjucksFilters(nunjucksEnv)
  }

  for (const [name, filter] of Object.entries(nunjucksFilters)) {
    nunjucksEnv.addFilter(name, filter)
  }
}

/**
 * @typedef {Parameters<Environment['addFilter']>[1]} NunjucksFilter
 * @typedef {Record<string, NunjucksFilter>} NunjucksFilters
 */

/**
 * @import { Environment } from 'nunjucks'
 */
