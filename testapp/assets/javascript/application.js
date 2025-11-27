import { initAll } from 'nhsuk-frontend'

initAll()

document.addEventListener('DOMContentLoaded', function () {
  const appTest = document.querySelector('[data-module="app-test"]')
  if (appTest) {
    appTest.textContent = '✅'
  }
})
