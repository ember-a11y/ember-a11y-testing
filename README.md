# ember-axe

Ember Axe is a wrapper around [Deque Labs'](https://github.com/dequelabs)
[axe-core](https://github.com/dequelabs/axe-core) accessibility testing engine.
It automatically integrates into your testing environment by running during the
`afterRender` step in the [run loop](http://guides.emberjs.com/v1.10.0/understanding-ember/run-loop/).

## Usage

Usage right now is super simple, just install the addon via:

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

## Future Plans

Moving forward, the main goal of Ember Axe is to integrate accessibility
awareness into every aspect of development, not just during testing. This means
having components (and views) audit themselves during development and visually
highlighting any potential issues during development.
