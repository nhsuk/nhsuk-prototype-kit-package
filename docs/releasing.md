# NHS prototype kit: Releasing

To release a new version of the kit to npm, follow these steps:

1. Update the version number, following [semantic versioning](https://semver.org) guidlines to either update the major, minor or patch number:

```bash
npm version patch --no-git-tag-version
npm version minor --no-git-tag-version
npm version major --no-git-tag-version
```

2. Update the `CHANGELOG.md` to change the `## Unreleased` heading at the top to be the new version number and date

3. Open a pull request containing the updates to the package.json and CHANGELOG, and then merge this once approved.

4. Visit [Create a new release page](https://github.com/nhsuk/nhsuk-prototype-kit-package/releases/new) on GitHub. In the 'Choose a tag' dropdown, create a new tag for the new version number, prefixed with a `v`. Use the same format for the release title. You can use the 'Generate release notes' feature to generate some initial release notes, and then edit these as needed. Make sure the "Set as latest release" checkbox is checked. Publish the release (or save as draft if you’re not ready). This will then automatically publish the release on npm.

## Once released

Update the [NHS prototype kit template](https://github.com/nhsuk/nhsuk-prototype-kit) with the new release version number.

If the release is a major or minor release, add some details about the new release to the [What’s new page](https://github.com/nhsuk/nhsuk.service-manual.prototype-kit.docs/blob/main/app/views/whats-new/updates.html) on the prototype kit website.

If the release contains new features or breaking changes, make sure these are documented on the prototype kit website.

Announce the new release on the Service Manual Slack, NHS England Slack, and any other appropriate locations.
