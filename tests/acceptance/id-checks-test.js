/* global checkIds */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: id-checks', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('checkIds should pass', function(assert) {
  visit('/id-checks');

  andThen(function() {
    let multipleId = document.getElementById('multiple-ids duplicate-id');
    multipleId.id = 'valid-id';
    assert.ok(checkIds());
  });
});

test('checkIds should fail when an element has multiple ids', function(assert) {
  visit('/id-checks');

  andThen(function() {
    assert.throws(() => checkIds(), /multiple IDs/);
  });
});

test('checkIds should fail when an element has a duplicate ids', function(assert) {
  visit('/id-checks');

  andThen(function() {
    let multipleId = document.getElementById('multiple-ids duplicate-id');
    multipleId.id = 'duplicate-id';
    assert.throws(() => checkIds(), /used more than once/);
  });
});
