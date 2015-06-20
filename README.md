# ember-axe

Ember Axe is a wrapper around [Deque Labs'](https://github.com/dequelabs)
[axe-core](https://github.com/dequelabs/axe-core) accessibility testing engine.
It automatically integrates into your testing environment by running during the
`afterRender` step in the [run loop](http://guides.emberjs.com/v1.10.0/understanding-ember/run-loop/).
And, it integrates into your development workflow by running during a
component's `didRender` phase in non-production environments.

## Future Plans

Moving forward, the main goal of Ember Axe is to integrate accessibility
awareness into every aspect of development, not just during testing. This means
having components (and views) audit themselves during development and visually
highlighting any potential issues during development.

## Usage In Testing

Usage inside tests right now is super simple, just install the addon via:

```bash
ember install ember-axe
```

That's it! It will automatically begin running during _acceptance_ tests. It
also injects the `axe` object globally during development so you can run tests
while developing your application as well.

### Disable/Enable Tests

By default, the axe-core tests only run during acceptance tests. In order to
enable them for other tests, simply run the following at the beginning of your
testing module:

```javascript
axe.ember.turnAxeOn();
```

On the flip side, if you want to turn tests off, simply use:

```javascript
axe.ember.turnAxeOff();
```

_Note:_ any tests run with Ember Axe will adjust the testing container to occupy
the entire screen. This is to simulate the actual application environment, as
browsers adjust styles at small sizes for accessibility reasons.

### Options

You can pass specific options to be used during `a11yCheck` by setting them on a
global `testOptions` property:

```javascript
axe.ember.testOptions = {
  runOnly: {
      type: "tag",
      values: ["wcag2a"]
    }
};
```

You can see available options in the [axe-core repo](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#b-options-parameter).

_Note:_ the options will stay set, until set to something different.

## Usage In Development

Usage during development is restricted to applications using Ember 1.13 and up
as it relies on the `didRender` hook of a component's life-cycle. Setup is as
simple as for testing, simply install the addon.

By default, Ember Axe will audit a component for accessibility each time it is
rendered. This ensures that the component is still accessible even after state
changes. It can also help pick up when you are making visual changes outside the
Ember run loop.

### Component Hooks

During development, we provide several hooks to help prevent Ember Axe from
getting in the way.

#### Defining a custom callback

To define a custom callback, which receives the results of the `a11yCheck`
audit, simply set it as `axeCallback` on the component in question:

```javascript
axeCallback(results) {
  // do stuff with results
}
```

#### Setting options for the audit

To set custom options for the `a11yCheck` audit, override the `axeOptions`
property value:

```javascript
axeOptions: { /* a11yCheck options */ }
```

#### Turning the audit off

If you really find the audits to be cramping development, you can turn them off
via a simple boolean switch:

```javascript
turnAxeOff: true
```
