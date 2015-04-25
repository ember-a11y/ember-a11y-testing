/* global verifyRequiredAria, checkAriaRoles */

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
    assert.throws(verifyRequiredAria(noRole));
  });
});

test('verifyRequiredAria throws error on one required property', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let checkboxRole = find('[role="checkbox"]')[0];
    assert.throws(function() {
      verifyRequiredAria(checkboxRole);
    },/required to have the attribute 'aria-checked' when using role='checkbox'/);
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
    assert.throws(function() {
      verifyRequiredAria(sliderRole);
    },/required to have the attribute 'aria-valuemax' when using role='slider'/);
  });
});

test('verifyRequiredAria throws error on multiple required properties partially missing', function(assert) {
  visit('/aria-properties');

  andThen(function() {
    let sliderRole = find('[role="slider"]')[0];
    sliderRole.setAttribute('aria-valuemax', '10');
    sliderRole.setAttribute('aria-valuenow', '5');
    assert.throws(function() {
      verifyRequiredAria(sliderRole);
    },/required to have the attribute 'aria-valuemin' when using role='slider'/);
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
    assert.throws(function() {
      checkAriaRoles();
    }, /A11yError/);
  });
});
