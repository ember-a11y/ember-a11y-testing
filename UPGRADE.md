# Upgrading to ember-a11y-testing 8.0.0

This guide covers the changes consumers need to make when upgrading `ember-a11y-testing` from 7.x to 8.0.0 (Embroider-native v2 addon format).

> **All imports from `ember-a11y-testing/test-support` remain unchanged.** The public API (`a11yAudit`, `setupGlobalA11yHooks`, `setupConsoleLogger`, `setupMiddlewareReporter`, `shouldForceAudit`, `setRunOptions`, `setEnableA11yAudit`, `useMiddlewareReporter`, `setupQUnitA11yAuditToggle`, etc.) is the same.

---

## Requirements

| Requirement | 7.x | 8.0.0 |
| --- | --- | --- |
| Node.js | `>= 16` | `>= 18` |
| Ember.js | v4+ | v4+ (unchanged) |
| Build system | Ember CLI (classic) | Embroider or `ember-auto-import` v2 |
| `@ember/test-helpers` | `^3.0.3 \|\| ^4.0.2 \|\| ^5.0.0` | unchanged |

## Installation

The `ember install` command is no longer used for v2 addons. Install with your package manager directly:

```bash
# 7.x
ember install ember-a11y-testing

# 8.0.0
npm install --save-dev ember-a11y-testing
# or
pnpm add -D ember-a11y-testing
# or
yarn add -D ember-a11y-testing
```

## Breaking Changes

### 1. `ENABLE_A11Y_AUDIT` environment variable no longer works

In 7.x, the `CliOptionsFilter` Broccoli plugin rewrote source code at build time, replacing the `ENABLE_A11Y_AUDIT` constant with `true` when the environment variable was set. This build-time rewriting does not exist in v2 addons.

**7.x:**

```bash
ENABLE_A11Y_AUDIT=true ember test
```

**8.0.0 — choose one:**

- **Query parameter** (recommended): Add `?enableA11yAudit` to your test URL:
  ```
  http://localhost:7357/?enableA11yAudit
  ```
  When using Testem, add it to your `testem.js`:
  ```js
  module.exports = {
    test_page: 'tests/index.html?hidepassed&enableA11yAudit',
    // ...
  };
  ```

- **Programmatic**: Call `setEnableA11yAudit(true)` in your test helper or test setup:
  ```js
  import { setEnableA11yAudit } from 'ember-a11y-testing/test-support';

  setEnableA11yAudit(true);
  ```

- **QUnit toggle**: Use `setupQUnitA11yAuditToggle(QUnit)` to add a checkbox in the QUnit UI that sets the query parameter.

### 2. `ENABLE_A11Y_MIDDLEWARE_REPORTER` environment variable no longer works

Same reason as above — no build-time rewriting in 8.0.0.

**7.x:**

```bash
ENABLE_A11Y_MIDDLEWARE_REPORTER=true ember test
```

**8.0.0:**

Use the `?enableA11yMiddlewareReporter` query parameter instead:

```
http://localhost:7357/?enableA11yMiddlewareReporter
```

### 3. Server middleware is no longer auto-configured

In 7.x, the addon automatically registered Express middleware via its `serverMiddleware` and `testemMiddleware` hooks in `index.js`. This provided the `/report-violations` endpoint that `setupMiddlewareReporter()` posts to.

In 8.0.0, there are no `serverMiddleware`/`testemMiddleware` hooks. **You must set up the server-side middleware yourself** if you use `setupMiddlewareReporter()`.

**Action required if you use `setupMiddlewareReporter()`:**

Configure the built-in middleware in your Testem config (`testem.js`):

```js
const { a11yMiddleware } = require('ember-a11y-testing/middleware');

module.exports = {
  // ... other testem config
  middleware: [a11yMiddleware],
};
```

The middleware accepts an optional options object if you need to customise paths:

```js
const { a11yMiddleware } = require('ember-a11y-testing/middleware');

module.exports = {
  middleware: [
    function (app) {
      a11yMiddleware(app, {
        root: __dirname,              // defaults to process.cwd()
        reportDir: 'ember-a11y-report', // defaults to 'ember-a11y-report'
        urlPath: '/report-violations',  // defaults to '/report-violations'
      });
    },
  ],
};
```

Your browser-side code (`setupMiddlewareReporter()` in `tests/test-helper.js`) remains unchanged.

> **Note:** The `@scalvert/ember-setup-middleware-reporter` package is no longer needed. You can remove it from your dependencies.

### 4. `axe-core` is now a peer dependency

In 7.x, `axe-core` was bundled as a direct dependency. In 8.0.0, it is a peer dependency so you can control which version runs your audits.

```bash
npm install --save-dev axe-core
```

### 5. `content-for` hook removed (no action needed)

In 7.x, the addon injected CSS into `{{content-for "test-head-footer"}}` to style axe's running indicator. In 8.0.0, these styles are shipped as a static CSS file that is automatically included when you use `a11yAudit()`. **No consumer action is required** — this is transparent and CSP-safe.

---

## No Changes Required

The following imports and usage patterns continue to work exactly as before:

```js
// tests/test-helper.js
import {
  a11yAudit,
  setupGlobalA11yHooks,
  setupConsoleLogger,
  setupMiddlewareReporter,
  setupQUnitA11yAuditToggle,
  shouldForceAudit,
  setRunOptions,
  setEnableA11yAudit,
  useMiddlewareReporter,
  DEFAULT_A11Y_TEST_HELPER_NAMES,
} from 'ember-a11y-testing/test-support';
```

## Migration Checklist

- [ ] Ensure your app uses Embroider or `ember-auto-import` v2
- [ ] Ensure Node.js >= 18
- [ ] Replace `ember install ember-a11y-testing` with `npm/pnpm/yarn add -D ember-a11y-testing`
- [ ] Install `axe-core` as a dev dependency: `npm/pnpm/yarn add -D axe-core`
- [ ] Replace `ENABLE_A11Y_AUDIT=true ember test` with `?enableA11yAudit` query param or `setEnableA11yAudit(true)`
- [ ] Replace `ENABLE_A11Y_MIDDLEWARE_REPORTER=true ember test` with `?enableA11yMiddlewareReporter` query param
- [ ] If using `setupMiddlewareReporter()`: configure the built-in middleware in your Testem config (see section 3)
