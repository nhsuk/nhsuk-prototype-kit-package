import { join, parse } from 'node:path'

import { globSync } from 'glob'

import { unslugify } from '../nunjucks-filters/unslugify.js'

const collator = new Intl.Collator('en', {
  ignorePunctuation: true,
  numeric: true,
  sensitivity: 'base'
})

/**
 * List pages in a directory
 *
 * @param {string} [path] - Views subdirectory to list pages from
 */
export function pageListing(path = 'app/views') {
  /** @type {Map<string, Page>} */
  const cache = new Map()
  const children = []

  cache.set('', {
    text: '',
    href: '/',
    children
  })

  const basePath = join(process.cwd(), path)
  const paths = globSync(join(basePath, '**/*.{html,njk}'), {
    absolute: false,
    cwd: basePath,
    nodir: true
  })

  // Create page listing
  for (const path of paths) {
    const { dir, name } = parse(path)
    const { children } = createParent(dir, cache)

    if (name !== 'index') {
      createPage(children, dir, name)
    }
  }

  // Sort pages
  return sortPage({ children })
}

/**
 * Create or return existing parent page
 *
 * @param {string} dir - Page directory
 * @param {Map<string, Page>} cache - Page cache
 * @returns {Page} Page
 */
function createParent(dir, cache) {
  let page = cache.get(dir)

  if (page) {
    return page
  }

  const { dir: parent, name } = parse(dir)
  const { children } = createParent(parent, cache)

  page = createPage(children, parent, name)

  cache.set(dir, page)

  return page
}

/**
 * Create page
 *
 * @param {Page[]} siblings - Page siblings
 * @param {string} parent - Page directory
 * @param {string} name - Page name
 * @returns {Page} Page
 */
function createPage(siblings, parent, name) {
  const length = siblings.push({
    text: unslugify(name),
    href: `/${join(parent, name)}`,
    children: []
  })

  return siblings[length - 1]
}

/**
 * @param {Pick<Page, 'children'>} page
 */
function sortPage({ children }) {
  children.sort((pageA, pageB) => collator.compare(pageA.href, pageB.href))
  children.forEach(sortPage)
  return children
}

/**
 * @typedef {object} Page
 * @property {string} text - Page text
 * @property {string} href - Page href
 * @property {string} [parent] - Page directory
 * @property {Page[]} children - Page children
 */
