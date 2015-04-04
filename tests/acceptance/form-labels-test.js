/* global hasLabel */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: form-labels', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('hasLabel passes', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var label = find('#has-label')[0];
    assert.ok(hasLabel(label));
  });
});

test('hasLabel fails due to no ID', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var label = find('[type="password"]')[0];
    assert.throws(function() {
      hasLabel(label);
    }, /has no ID/);
  });
});

test('hasLabel fails due to no label element', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var label = find('#has-no-label')[0];
    assert.throws(function() {
      hasLabel(label);
    }, /has no associated label/);
  });
});

test('hasLabel fails due to no label content', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var label = find('#has-no-label-content')[0];
    assert.throws(function() {
      hasLabel(label);
    }, /has no content/);
  });
});
