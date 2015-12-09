/* global a11yTest */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: a11y-test', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('a11yTest runs all tests with default values', function(assert) {
  visit('/a11y-test');

  andThen(function() {
    assert.ok(a11yTest());

    let imageWithAltText = find('#alt-text')[0];
    imageWithAltText.removeAttribute('alt');
    assert.throws(function() {
      a11yTest();
    }, /A11yError/);
  });
});

test('a11yTest runs all tests with truthy config values', function(assert) {
  visit('/a11y-test');

  andThen(function() {
    assert.ok(a11yTest());

    let pWithoutAria = find('#no-aria')[0];
    pWithoutAria.innerHTML = '';
    assert.throws(function() {
      a11yTest({ checkForNoRead: 'throwErrors' });
    }, /A11yError/);
  });
});

test('a11yTest does not run tests with falsy config values', function(assert) {
  visit('/a11y-test');

  andThen(function() {
    let imageWithAltText = find('#alt-text')[0];
    imageWithAltText.removeAttribute('alt');
    assert.ok(a11yTest({ allImagesHaveAltText: false }));
    assert.throws(function() {
      a11yTest();
    }, /A11yError/);
  });
});
