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

That's it! It will automatically begin running during tests. It also injects
the `axe` object globally during development so you can run tests while
developing your application as well.

## Future Plans

Moving forward, the main goal of Ember Axe is to integrate accessibility
awareness into every aspect of development, not just during testing. This means
having components (and views) audit themselves during development and visually
highlighting any potential issues during development.
