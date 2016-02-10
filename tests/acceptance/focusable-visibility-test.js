/* global isAllowedFocus, allAreAllowedFocus */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: focusable-visibility', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('isAllowedFocus passes on visible span', function(assert) {
  visit('/focusable-visibility');

  andThen(function() {
    let visibleElement = document.querySelectorAll('#visible-element')[0];
    assert.ok(isAllowedFocus(visibleElement));
  });
});

test('isAllowedFocus passes on aria visible text field', function(assert) {
  visit('/focusable-visibility');

  andThen(function() {
    let visibleElement = document.querySelectorAll('#not-aria-hidden')[0];
    assert.ok(isAllowedFocus(visibleElement));
  });
});

test('isAllowedFocus throws error', function(assert) {
  visit('/focusable-visibility');

  andThen(function() {
    let hiddenElement = find('#hidden-field')[0];
    assert.throws(function() {
      isAllowedFocus(hiddenElement);
    }, /A11yError/);
  });
});

test('allAreAllowedFocus passes', function(assert) {
  visit('/focusable-visibility');

  andThen(function() {
    let failingElements = find('#display-none, #visibility-none, #height-none, #width-none, #opacity-none, #hidden-field, #aria-hidden');
    for (let i = 0, l = failingElements.length; i < l; i++) {
      failingElements[i].removeAttribute('tabindex');
    }
    assert.ok(allAreAllowedFocus());
  });
});

test('allAreAllowedFocus throws error', function(assert) {
  visit('/focusable-visibility');

  andThen(function() {
    assert.throws(function() {
      allAreAllowedFocus();
    }, /A11yError/);
  });
});
