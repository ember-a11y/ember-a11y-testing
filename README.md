# ember-a11y-testing

[![CI Build](https://github.com/ember-a11y/ember-a11y-testing/workflows/CI%20Build/badge.svg)](https://github.com/ember-a11y/ember-a11y-testing/actions?query=workflow%3A%22CI+Build%22)
[![NPM Version](https://badge.fury.io/js/ember-a11y-testing.svg)](http://badge.fury.io/js/ember-a11y-testing)
[![Ember Observer Score](https://emberobserver.com/badges/ember-a11y-testing.svg)](https://emberobserver.com/addons/ember-a11y-testing)

Ember A11y Testing is a wrapper around [Deque Labs'](https://github.com/dequelabs)
[axe-core](https://github.com/dequelabs/axe-core) accessibility testing engine.
It integrates into your testing environment with a simple `a11yAudit()` helper.

If you're using Ember 1.13.0 or above, it also integrates into your development
workflow by running during a component's `didRender` phase in non-production
environments. This gives you instant feedback on if your components are
accessible in any given state.

## Compatibility

- Ember.js v3.0.0 or above
- Ember CLI v3.0.0 or above
- Node.js v10 or above

## Installation

```bash
ember install ember-a11y-testing
```

## Usage

### aXe Options

When using the `a11yAudit` helper, you can pass in `axe-core` options.
These options are documented in the [axe-core API docs](https://www.deque.com/axe/axe-for-web/documentation/api-documentation/#options-parameter).
The rule definitions are documented on [dequeuniversity.com/rules](https://dequeuniversity.com/rules/axe/3.2).

### Testing Usage

Ember A11y Testing also provides a simple helper to run accessibility audits
on-demand within your test suite.

_Note:_ any tests run with Ember A11y Testing will adjust the testing container
to occupy the entire screen. This is to simulate the actual application
environment, as browsers adjust styles at small sizes for accessibility reasons.
It will reset itself at the conclusion of testing though.

#### Acceptance Tests

For Acceptance tests, the helper is an async test helper so you can use it like
this:

```javascript
import a11yAudit from 'ember-a11y-testing/test-support/audit';

// ...elided for brevity

test('Some test case', async function (assert) {
  await visit('/');
  await a11yAudit();
  assert.ok(true, 'no a11y errors found!');
});
```

If your app does not allow async/await, you will need to use the the andThen() helper and a regular function (as opposed to `async function`).

```javascript
import a11yAudit from 'ember-a11y-testing/test-support/audit';

// ...elided for brevity

test('Some test case', function (assert) {
  visit('/');
  a11yAudit();
  andThen(() => assert.ok(true, 'no a11y errors found!'));
});
```

The helper can optionally accept a "context" on which to focus the audit as
either a selector string or an HTML element. You can also provide a secondary
parameter to specify axe-core options:

```js
test('Some test case', async function (assert) {
  let axeOptions = {
    rules: {
      'button-name': {
        enabled: false,
      },
    },
  };

  await visit('/');
  await a11yAudit(axeOptions);
  assert.ok(true, 'no a11y errors found!');
});
```

Or specify options as a single argument:

```js
test('Some test case', async function (assert) {
  let axeOptions = {
    rules: {
      'button-name': {
        enabled: false,
      },
    },
  };

  await visit('/');
  await a11yAudit('.modal', axeOptions);
  assert.ok(true, 'no a11y errors found!');
});
```

#### Integration and Unit Tests

The helper is also able to be used Integration/Unit tests like so:

```javascript
import a11yAudit from 'ember-a11y-testing/test-support/audit';

// ...elided for brevity

test('Some test case', function (assert) {
  this.render(hbs`{{some-component}}`);

  let axeOptions = {
    rules: {
      'button-name': {
        enabled: false,
      },
    },
  };
  return a11yAudit(this.element, axeOptions).then(() => {
    assert.ok(true, 'no a11y errors found!');
  });
});
```

As you can see, the usage for all types of tests is pretty much the same. The
only real difference is Acceptance tests get automatic async handling.

#### Optionally Running a11yAudit

Ember A11y Testing also allows you to run audits only if `enableA11yAudit`
is set as a query param on the test page. This is useful if you want to conditionally
run accessibility audits, such as during nightly build jobs.

To do so, import and use `shouldForceAudit` from `ember-a11y-testing`, as shown below.

```javascript
// `&enableA11yAudit` set in the URL
import { a11yAudit, shouldForceAudit } from 'ember-a11y-testing/test-support';

test('Some test case', await function(assert) {
  await visit('/');

  if (shouldForceAudit()) {
    await a11yAudit();
  }
  assert.ok(true, 'no a11y errors found!');
});
```

```javascript
// No `enableA11yAudit` set in the URL
import { a11yAudit, shouldForceAudit } from 'ember-a11y-testing/test-support';

test('Some test case', await function(assert) {
  await visit('/');

  if (shouldForceAudit()) {
    await a11yAudit();  // will not run
  }
  // ...
});
```

You can also create your own app-level helper, which will mimic the same functionality that was provide
by `a11yAuditIf`:

```javascript
export function a11yAuditIf(contextSelector, axeOptions) {
  if (shouldForceAudit()) {
    return a11yAudit(contextSelector, axeOptions);
  }

  return resolve(undefined, 'a11y audit not run');
}
```

#### Setting Options

You can provide options to axe-core for your tests using the `setRunOptions` API. Options can
be set a few ways:

Globally:

```javascript
// tests/test-helper.js
import { setRunOptions } from 'ember-a11y-testing';

setRunOptions({
  rules: {
    region: { enabled: true },
  },
  checks: {
    'color-contrast': {
      options: {
        noScroll: true,
      },
    },
  },
});
```

Test module level:

```javascript
import { module, test } from 'qunit';
import { setRunOptions } from 'ember-a11y-testing';

module('some test module', function (hooks) {
  hooks.before(function () {
    setRunOptions({
      rules: {
        region: { enabled: true },
      },
      checks: {
        'color-contrast': {
          options: {
            noScroll: true,
          },
        },
      },
    });
  });

  // ...
});
```

Individual test level:

```javascript
import { module, test } from 'qunit';
import { a11yAudit } from 'ember-a11y-testing/test-support';
import { setRunOptions } from 'ember-a11y-testing';

module('some test module', function (hooks) {
  test('some test', function (assert) {
    setRunOptions({
      rules: {
        region: { enabled: true },
      },
      checks: {
        'color-contrast': {
          options: {
            noScroll: true,
          },
        },
      },
    });

    // ...
    a11yAudit();
    // ...
  });

  // ...
});
```

Options are automatically torn down when the test context's owner is destroyed.

### Development Usage

While this addon previously included a number of components that would aid in identifying axe violations during development, those have been deprecated in favor of other, industry standard tools such as:

- [**Lighthouse**](https://developers.google.com/web/tools/lighthouse) - an open-source, automated tool for improving the quality of web pages. You can run it against any web page, public or requiring authentication. It has audits for performance, accessibility, progressive web apps, SEO and more.
  - Homepage: https://developers.google.com/web/tools/lighthouse
- [**Sa11y**](https://ryersondmp.github.io/sa11y/) - an accessibility quality assurance tool that visually highlights common accessibility and usability issues. Geared towards content authors, Sa11y indicates errors or warnings at the source with a simple tooltip on how to fix.
- [**axe Chrome extension**](https://www.deque.com/axe/browser-extensions/) - a free axe browser extension ideal for development teams to test web applications to help identify and resolve common accessibility issues.
  [**Accessibility Insights for Web**](https://accessibilityinsights.io/docs/en/web/overview) - Accessibility Insights for Web helps developers find and fix accessibility issues in web apps and sites. This browser extension for Chrome and the new Microsoft Edge runs on Windows, MacOS, and Linux computers.

## Future Plans

Now that your components and acceptance tests can self-audit, the next step
going forward is to give helpful and meaningful feedback to developers. This
means easily highlighting areas with violations and giving suggestions on how to
fix and improve them. Additionally, work will be done to tackle Ember-specific
accessibility issues, such as identifying actions on inaccessible elements.
