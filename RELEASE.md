# Release Process

The following is the release process you should follow to publish a new version of `ember-a11y-testing`.

## Update The Changelog

First, we need to update the `CHANGELOG.md` file for the project. This requires having [`git-extras`](https://github.com/tj/git-extras) installed.

Checkout the current `master` version of the repo and run:

```bash
git changelog
```

Clean up the generated changelog by inserting the appropriate verion number and removing merge commits and previous release commits if necessary.

Review the changes and then commit them with a message like:

```bash
git commit -am "Update CHANGELOG for x.x.x"
```

Where `x.x.x` is the version you are releasing.

## Bump The Version

Next, we bump the version of the addon and tag it. You can do this by using the default `npm version` command, like so:

```bash
npm version x.x.x
```

That should bump the version in `package.json`, commit it, and then tag it.

Next, push the version bump and the changelog changes to the repository (ensure you push the new tag as well).

## Publish The Release

Once the changes have been pushed, run:

```bash
npm publish
```

To actually publish the new release.

Finally, update the [GitHub Releases page](https://github.com/ember-a11y/ember-a11y-testing/releases) with a new release; using the changelog info as the release notes.