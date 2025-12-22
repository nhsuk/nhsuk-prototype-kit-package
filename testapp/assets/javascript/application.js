document.addEventListener('DOMContentLoaded', function () {
  const appTest = document.querySelector('[data-module="app-test"]')
  if (appTest) {
    appTest.textContent = '✅'
  }
})
