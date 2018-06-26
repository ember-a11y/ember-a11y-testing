# 0.5.2 / 2018-06-05

  * Improve Test Failure Messages (#103)
  * Update README with aXe Options and Scoped Auditing (#104)
  * Upgrade axe-core to 2.6.1 (#98)
  * Fix: `a11yAudit` not using default `axeOptions` (#100)

# 0.5.1 / 2018-02-20

  * Update Ember-CLI to 2.18.x (#94)
  * Add check of `isDestroyed` when running an audit (#92)

# 0.5.0 / 2017-10-19

  * Update a couple more dependencies
  * Update runtime dependencies

# 0.4.4 / 2017-10-05

  - Package upgrades and locking version of htmlbars-inline-precompile
  - update README -change double-ticks to single-ticks
  - update README to combine axeOptions examples
  - README - example to disable color contrast scroll

# 0.4.3 / 2017-06-21

- Present information in an easy-to-digest format #18 (#78)
- Add example on Readme to disable specific checks

# 0.4.2 / 2017-05-19

- Add release notes
- Update axe-core version and range

# 0.4.1 / 2017-03-24

- Don't include content for production builds

# 0.4.0 / 2017-03-22

- Update readme with new features/info
- Support passing options as a single argument to a11yAudit
- feat(a11yAudit): opt in to a11yAudit
- Fix axe-component error test
- Ensure `super` call is bounded

# 0.3.0 / 27-02-2017

- Replace `jshint` with `eslint`
- Update `readme` with new, simpler test API
- Remove auto-run feature
- Ensure `axe-core` is included in production test builds
- Remove blueprint tests from `npm` scripts
- Remove `babel` polyfill from test app

# 0.2.2 / 20-02-2017

- Allow `turnAuditOff` to be defined globally

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
