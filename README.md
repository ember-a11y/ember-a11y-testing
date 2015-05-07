# Ember A11y Testing

A suite of accessibility tests that can be run within the Ember testing
framework. The goal is to help pick up on completely avoidable accessibility
issues (such as alt text for images, labels in forms, and color contrast) during
your testing pipeline.

## Usage

There are two ways to use this add-on:

- **Test Suite**: This is useful for a high-level overview of accessibility on
your page.
- **Individual Tests**: This is useful for making sure specific elements or
modules on your page meet a specific requirement.

### Test Suite

To run an entire suite of a11y tests, simply call the `a11yTest` method from
inside one of your assertions. If all tests pass, it will return `true` (making
it easy to assert against); otherwise, an error gets thrown (and occassionally,
a `console.warn`).

**Example:**

```js
test('Home page passes a11y tests', function(assert) {
  visit('/');

  andThen(function() {
    assert.ok(a11yTest());
  });
});
```

That's it! You can also configure which tests you want to run by passing in a
configuration object like so:

```js
test('Home page passes a11y tests', function(assert) {
  visit('/');

  andThen(function() {
    assert.ok(a11yTest({
      checkForNoRead: false  
    }));
  });
});
```

Details on what tests are available and what options you can use on them are
given below (in the Testing/Feature List section).

### Individual Tests

Running individual tests is simple. It is essentially just calling a function.
Will add documentation for all of these eventually...

## Testing/Feature List

Below are the tests and options that run in the `a11yTest` suite. By default,
all tests run with a config value of `true`; they can be disabled by passing in
`false` in their configuration.

### `allImagesHaveAltText`
Checks all images on the page to ensure they have `alt` text or that they have
`aria-hidden=true`.

### `checkForNoRead`
Checks text-based elements for content and visibility to determine if they might
want to add `aria-hidden="true"`. By default this only puts on a warning in the
console as it is a suggestion, not an accessibility rule.

Other config values:
  - `"throwErrors"` - Makes the test throw errors rather than warnings

### `allFormsHaveLabels`
Checks all forms on the page to ensure they have proper labeling/alternative
text properties for all of their inputs. Currently, checks for labelling via ID
and the `for` attribute, `aria-describedby`, and `aria-labelledby`.

### `checkAriaRoles`
Checks all elements with the `role` property to ensure they have all required
ARIA properties for that role. _Upcoming: will check to ensure all ARIA
properties applied are valid for that role._

### `checkIds`
Checks all elements to ensure they don't have multiple IDs and that their ID is
unique.

## Todo List

Below is the current list of proposed tests that will be built. Please feel free
to begin working on one of the below or open an issue for a new idea to add to
this list.

- Check ARIA properties for elements with defined roles to ensure validity (__in
progress__)
- Alternative text for other elements (e.g., `object`, `embed`)
- Color contrast for text on backgroundss (minimum and enhanced options)
- Check adjacent links for merging
