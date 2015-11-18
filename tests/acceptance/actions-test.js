/* global actionIsFocusable, allActionsFocusable */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: actions', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

/* actionIsFocusable */

test('actionIsFocusable passes', function(assert) {
  visit('/actions');

  andThen(function() {
    let focusableByDefault = find('#focusable-by-default')[0];
    assert.ok(actionIsFocusable(focusableByDefault));

    let focusableByTabindex = find('#focusable-by-tabindex')[0];
    assert.ok(actionIsFocusable(focusableByTabindex));

    let formWithAction = find('form')[0];
    assert.ok(actionIsFocusable(formWithAction));
  });
});

test('actionIsFocusable throws error', function(assert) {
  visit('/actions');

  andThen(function() {
    let notFocusable = find('#not-focusable')[0];
    assert.throws(() => actionIsFocusable(notFocusable), /A11yError/);
  });
});

/* allActionsFocusable */

test('allActionsFocusable passes', function(assert) {
  visit('/actions');

  andThen(function() {
    let notFocusable = find('#not-focusable')[0];
    notFocusable.parentElement.removeChild(notFocusable);
    assert.ok(allActionsFocusable());
  });
});

test('allActionsFocusable throws error', function(assert) {
  visit('/actions');

  andThen(function() {
    assert.throws(() => allActionsFocusable(), /A11yError/);
  });
});
