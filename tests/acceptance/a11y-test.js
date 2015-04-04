/* global hasAltText, allImagesHaveAltText */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: A11y', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('alt-text: hasAltText passes', function(assert) {
  visit('/');

  andThen(function() {
    var altText = find('#alt-text')[0];
    assert.ok(hasAltText(altText));
  });
});

test('alt-text: hasAltText passes with aria-hidden', function(assert) {
  visit('/');

  andThen(function() {
    var ariaHidden = find('#aria-hidden')[0];
    assert.ok(hasAltText(ariaHidden));
  });
});

test('alt-text: hasAltText throws error', function(assert) {
  visit('/');

  andThen(function() {
    var noAltText = find('#no-alt-text')[0];
    assert.throws(function() {
      hasAltText(noAltText);
    }, /A11yError/);
  });
});

test('alt-text: allImagesHaveAltText passes', function(assert) {
  visit('/');

  andThen(function() {
    var noAltText = find('#no-alt-text')[0];
    noAltText.setAttribute('alt', 'has alt now');
    assert.ok(allImagesHaveAltText());
  });
});

test('alt-text: allImagesHaveAltText throws error', function(assert) {
  visit('/');

  andThen(function() {
    var noAltText = find('#no-alt-text')[0];
    assert.throws(function() {
      allImagesHaveAltText();
    }, /A11yError/);
  });
});
