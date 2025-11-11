/**
 * Sets the trust proxy setting
 *
 * @param app
 */
function setTrustProxy(app) {
  // This setting trusts the X-Forwarded headers set by
  // a proxy and uses them to set the standard header in
  // req. This is needed for hosts like Heroku.
  // See https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', 1)
}

module.exports = setTrustProxy
