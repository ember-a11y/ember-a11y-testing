# 0.2.1 / 15-02-2017

- Include axe-core in all non-prod environments

# 0.2.0 / 15-02-2017

- Properly report exceptions
- Move `axe-core` to `npm` dependency
- Add `a11y-audit` test helper
- Add waiter to ensure audits finish running before tests finish
- Upgrade all dependencies
- Remove application references in initializers

# 0.1.6 / 16-08-2016

- Ensure version of `axe-core` added to projects is in sync with the current dependency.
  - Implement initial testing for this behavior within `node-tests/blueprint-test.js`

# 0.1.5 / 09-08-2016

- Fix parsing of `axeViolationClassNames`, which previously wasn't reading strings the right way (#36)[https://github.com/ember-a11y/ember-a11y-testing/pull/36]

# 0.1.4 / 11-07-2016

- Update to `axe-core` @ 2.0.5. For `ember-a11y-testing`, that fixes [this](https://github.com/ember-a11y/ember-a11y-testing/issues/29)

# 0.1.3 / 16-06-2016

- Improve the [styles used for highlighting violations](https://github.com/ember-a11y/ember-a11y-testing/pull/28).

# 0.1.2 / 16-06-2016

- Create `CHANGELOG.md` 👍
- Update to `axe-core` @ 1.1.1 and ensure that `addBowerPackageToProject` in the default blueprint explicitly matches the version.
