/* global verifyRequiredAria, verifySupportedAria, checkAriaRoles */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: aria-properties', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

/* verifyRequiredAria */

test('verifyRequiredAria passes when element has no role', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let noRole = find('#no-role')[0];
    assert.ok(verifyRequiredAria(noRole));
  });
});

test('verifyRequiredAria throws error on one required property', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let checkboxRole = find('[role="checkbox"]')[0];
    assert.throws(() => verifyRequiredAria(checkboxRole), /required to have the attribute 'aria-checked' when using role='checkbox'/);
  });
});

test('verifyRequiredAria passes on one required property', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let checkboxRole = find('[role="checkbox"]')[0];
    checkboxRole.setAttribute('aria-checked', true);
    assert.ok(verifyRequiredAria(checkboxRole));
  });
});

test('verifyRequiredAria throws error on multiple required properties all missing', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let sliderRole = find('[role="slider"]')[0];
    assert.throws(() => verifyRequiredAria(sliderRole), /required to have the attribute 'aria-valuemax' when using role='slider'/);
  });
});

test('verifyRequiredAria throws error on multiple required properties partially missing', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let sliderRole = find('[role="slider"]')[0];
    sliderRole.setAttribute('aria-valuemax', '10');
    sliderRole.setAttribute('aria-valuenow', '5');
    assert.throws(() => verifyRequiredAria(sliderRole), /required to have the attribute 'aria-valuemin' when using role='slider'/);
  });
});

test('verifyRequiredAria passes on multiple required properties', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let sliderRole = find('[role="slider"]')[0];
    sliderRole.setAttribute('aria-valuemax', '10');
    sliderRole.setAttribute('aria-valuemin', '0');
    sliderRole.setAttribute('aria-valuenow', '5');
    assert.ok(verifyRequiredAria(sliderRole));
  });
});

test('verifyRequiredAria throws error on invalid role', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let sliderRole = find('[role="slider"]')[0];
    sliderRole.setAttribute('role', 'herp-de-derp');
    assert.throws(() => verifyRequiredAria(sliderRole), /not a valid role/);
  });
});

/* verifySupportedAria */

test('verifySupportedAria passes when element has no role', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let noRole = find('#no-role')[0];
    assert.ok(verifySupportedAria(noRole));
  });
});

test('verifySupportedAria passes with one supported property', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let slider = find('[role="slider"]')[0];
    slider.setAttribute('aria-orientation', 'vertical');
    assert.ok(verifySupportedAria(slider));
  });
});

test('verifySupportedAria passes with a required property', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let slider = find('[role="slider"]')[0];
    slider.setAttribute('aria-valuemin', 'vertical');
    assert.ok(verifySupportedAria(slider));
  });
});

test('verifySupportedAria passes with multiple supported properties', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let slider = find('[role="slider"]')[0];
    slider.setAttribute('aria-valuemin', 'vertical'); // required
    slider.setAttribute('aria-orientation', 'vertical'); // supported
    assert.ok(verifySupportedAria(slider));
  });
});

test('verifySupportedAria fails with one unsupported property', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let slider = find('[role="slider"]')[0];
    slider.setAttribute('aria-herp', 'derp');
    assert.throws(() => verifySupportedAria(slider), /not a supported ARIA/);
  });
});

test('verifySupportedAria fails with multiple unsupported properties', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let slider = find('[role="slider"]')[0];
    slider.setAttribute('aria-herp', 'derp');
    slider.setAttribute('aria-derp', 'herp');
    assert.throws(() => verifySupportedAria(slider), /not a supported ARIA/);
  });
});

test('verifySupportedAria fails with a mix of supported and unsupported properties', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let slider = find('[role="slider"]')[0];
    slider.setAttribute('aria-orientation', 'vertical');
    slider.setAttribute('aria-derp', 'herp');
    assert.throws(() => verifySupportedAria(slider), /not a supported ARIA/);
  });
});

test('verifySupportedAria throws error on invalid role', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let noRole = find('#no-role')[0];
    noRole.setAttribute('role', 'herp-de-derp');
    assert.throws(() => verifySupportedAria(noRole), /not a valid role/);
  });
});

/* checkAriaRoles */

test('checkAriaRoles passes', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let checkboxRole = find('[role="checkbox"]')[0];
    checkboxRole.setAttribute('aria-checked', true);

    let sliderRole = find('[role="slider"]')[0];
    sliderRole.setAttribute('aria-valuemax', '10');
    sliderRole.setAttribute('aria-valuemin', '0');
    sliderRole.setAttribute('aria-valuenow', '5');

    assert.ok(checkAriaRoles());
  });
});

test('checkAriaRoles throws error', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    assert.throws(() => checkAriaRoles(), /A11yError/);
  });
});
