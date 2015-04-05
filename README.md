# Ember A11y Testing

A suite of accessibility tests that can be run within the Ember testing
framework. The goal is to help pick up on completely avoidable accessibility
issues (such as alt text for images, labels in forms, and color contrast) during
your testing pipeline.

## Usage

Exact usage of this add-on is still being determined. Will fill this section in
once usage has been decided. Currently, the plan is to develop functions you can
run one-off (e.g., test this specific element), as a full-page (e.g., check all
images for alt text), and as a test-suite.

## Todo List

Below is the current list of proposed tests that will be built. Please feel free
to begin working on one of the below or open an issue for a new idea to add to
this list.

- Alternatives to labels for form elements (__in progress__)
- Elements that should have text but don't, such as icons, should have aria-hidden (__in progress__)
- Alternative text for other elements
- Color contrast for text on backgroundss (minimum and enhanced options)
- Tabbing availability
- ARIA properties for elements labeled with roles
