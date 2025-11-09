// This resolves a quirk with HTML which is that if a checkbox is
// not checked, the browser doesn’t send any data at all. This makes
// it impossible to know whether the user unchecked a checkbox, or if
// the checkbox wasn’t present on the page.
//
// This script adds a hidden input for each checkbox with the value of
// '_unchecked'. The auto-store-data.js middleware ignores these values
// when saving data.

const forms = document.querySelectorAll('form')

for (const form of forms) {
  form.addEventListener('submit', () => {
    const checkboxes = form.querySelectorAll("input[type='checkbox']")

    for (const checkbox of checkboxes) {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', checkbox.name)
      input.setAttribute('value', '_unchecked')
      form.appendChild(input)
    }
  })
}
