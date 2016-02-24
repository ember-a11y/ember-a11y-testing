# Ember A11y Testing

[![NPM Version](https://badge.fury.io/js/ember-a11y-testing.svg)](http://badge.fury.io/js/ember-a11y-testing)
[![Build Status](https://travis-ci.org/trentmwillis/ember-a11y-testing.svg)](https://travis-ci.org/trentmwillis/ember-a11y-testing)

A suite of accessibility tests that can be run within the Ember testing
framework. The goal is to help pick up on completely avoidable accessibility
issues (such as alt text for images, labels in forms, and color contrast) during
your testing pipeline.

## Installation

Within your Ember app, use the [Ember CLI](http://ember-cli.com/) to install this test suite as an add-on:

```bash
ember install ember-a11y-testing
```

## Usage

There are two ways to use this add-on:

- **Test Suite**: This is useful for a high-level overview of accessibility on
your page.
- **Individual Tests**: This is useful for making sure specific elements or
modules on your page meet a specific requirement.

### Test Suite

To run an entire suite of a11y tests, simply call the `a11yTest` method from
inside one of your assertions. If all tests pass, it will return `true` (making
it easy to assert against); otherwise, an error gets thrown (and occasionally,
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

### `allNonTextElementsHaveAltText`
Checks all non-text elements (img, audio, video, embed, object and canvas) on the page to ensure they have `alt` text or that they have
`aria-hidden="true"`/`role="presentation"`.

### `checkForNoRead`
Checks text-based elements for content and visibility to determine if they might
want to add `aria-hidden="true"`. By default this only puts on a warning in the
console as it is a suggestion, not an accessibility rule.

Other config values:
  - `'throwErrors'` - Makes the test throw errors rather than warnings

### `allFormsHaveLabels`
Checks all forms on the page to ensure they have proper labeling/alternative
text properties for all of their inputs. Currently, checks for labelling via ID
and the `for` attribute, `aria-describedby`, and `aria-labelledby`.

### `checkAriaRoles`
Checks all elements with the `role` property to ensure their role is valid, they
have all required ARIA properties for that role, and that all applied ARIA
properties/states are supported if not required.

### `checkIds`
Checks all elements to ensure they don't have multiple IDs and that their ID is
unique.

### `checkLinks`
Checks links to ensure they have a meaningful `href` attribute, textual content
that descibes the link, and that adjacent, duplicate links are merged.

### `checkAllTextContrast`
_Caution: experimental, so this test is disabled by default_

Grabs all text nodes on the page and checks their contrast against their
background element. If the background is an image (including gradients), it
throws a warning for caution when using images as background elements.

Other config values:
  - `'AAA'` - Runs the contrast checks at the 'AAA' level of conformance
  - `'AA'` - Runs the contrast checks at the 'AA' level of conformance

Note: _this won't pick up pseudo-elements that are used as backgrounds_. There
is potential to solve this issue using `getComputedStyle`, though a solid
solution has yet to be found.

### `allActionsFocusable`
Checks all elements on the page that have actions associated with them and
ensures that they can receive focus.

Note: _this check is DOM-based, and so only elements that use the Ember
`{{action}}` helper will be checked_.

### `allAreAllowedFocus`
Finds all elements on the page that have a `tabindex` property assigned to them,
and checks that they are visible. Although most browsers will intelligently turn off
manually applied focusability for hidden elements under certain conditions
(eg. `display:none`), this test is more liberal in order to be thorough.

## Todo List

Below is the current list of proposed tests that will be built. Please feel free
to begin working on one of the below or open an issue for a new idea to add to
this list.

- [ ] Verify values of aria states/properties
- [ ] Verify relationship of ARIA roles (radiogroup - radio, list - listitem,
etc.)
- [ ] Verify element is allowed to have ARIA attribute/role
