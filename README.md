# ember-axe

[![Build Status](https://travis-ci.org/trentmwillis/ember-axe.svg?branch=master)](https://travis-ci.org/trentmwillis/ember-axe)
[![NPM Version](https://badge.fury.io/js/ember-axe.svg)](http://badge.fury.io/js/ember-axe)

Ember Axe is a wrapper around [Deque Labs'](https://github.com/dequelabs)
[axe-core](https://github.com/dequelabs/axe-core) accessibility testing engine.
It automatically integrates into your testing environment by running during the
`afterRender` step in the [run loop](http://guides.emberjs.com/v1.10.0/understanding-ember/run-loop/)
during any acceptance tests.

If you're using Ember 1.13.0 or above, it also integrates into your development
workflow by running during a component's `didRender` phase in non-production
environments. This gives you instant feedback on if your component's are
accessible in any given state.

## Future Plans

Now that your components and acceptance tests can self-audit, the next step
going forward is to give helpful and meaningful feedback to developers. This
means easily highlighting areas with violations and giving suggestions on how to
fix and improve them. Additionally, work will be done to tackle Ember-specific
accessibility issues, such as identifying actions on inaccessible elements.

## Usage In Testing

Usage inside tests right now is super simple, just install the addon via:

```bash
ember install ember-axe
```

That's it! It will automatically begin running during _acceptance_ tests. It
also injects the `axe` object globally during development so you can run tests
while developing your application as well.

_Note:_ any tests run with Ember Axe will adjust the testing container to occupy
the entire screen. This is to simulate the actual application environment, as
browsers adjust styles at small sizes for accessibility reasons. It will reset
itself at the conclusion of testing though.

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

You can see the available options in the [axe-core repo](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#b-options-parameter).

_Note:_ the options will stay set, until set to something different.

## Usage In Development

Usage in development is restricted to applications using Ember 1.13 and up as it
relies on the `didRender` hook of a component's life-cycle (a feature only
available in versions of Ember with the Glimmer rendering engine).

That said, setup for development is as simple as it is for testing, simply
install the addon.

By default, Ember Axe will audit a component for accessibility each time it is
rendered. This ensures that the component is still accessible even after state
changes, and since the checks are scoped to a component's element, it means that
any state change propagated downwards is also caught.

### Component Hooks

Since development is not a uniform experience, Ember Axe provides several hooks
to help stay out of the way.

_Note:_ these are all `undefined` by default.

#### Defining a custom callback

If you feel the logging of violations is poor or you just want to see the entire
results of a component's audit, you can define a custom callback. The callback
receives the results of the `a11yCheck` audit that is scoped to the component's
element. Simply set it as `axeCallback` on the component in question:

```javascript
axeCallback(results) {
  // do stuff with results
}
```

#### Setting options for the audit

As with testing, if you need to set custom auditing options for a component, you
can do so easily. Simply set a value for the `axeOptions` property value:

```javascript
axeOptions: { /* a11yCheck options */ }
```

#### Turning the audit off

Lastly, if you really find the audits to be cramping development, you can turn
them off via a simple boolean switch:

```javascript
turnAuditOff: true
```
