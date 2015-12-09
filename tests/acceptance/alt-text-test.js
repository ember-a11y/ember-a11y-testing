/* global hasAltText, allImagesHaveAltText */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: alt-text', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('hasAltText passes', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let altText = find('#alt-text')[0];
    assert.ok(hasAltText(altText));
  });
});

test('hasAltText passes for empty alt attribute', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let altText = find('#empty-alt-text')[0];
    assert.ok(hasAltText(altText));
  });
});

test('hasAltText passes with aria-hidden', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let ariaHidden = find('#aria-hidden')[0];
    assert.ok(hasAltText(ariaHidden));
  });
});

test('hasAltText passes with presentation role', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let presentationRole = find('#presentation')[0];
    assert.ok(hasAltText(presentationRole));
  });
});

test('hasAltText throws error', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let noAltText = find('#no-alt-text')[0];
    assert.throws(function() {
      hasAltText(noAltText);
    }, /A11yError/);
  });
});

test('allImagesHaveAltText passes', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let noAltText = find('#no-alt-text')[0];
    noAltText.setAttribute('alt', 'has alt now');
    assert.ok(allImagesHaveAltText());
  });
});

test('allImagesHaveAltText throws error', function(assert) {
  visit('/alt-text');

  andThen(function() {
    assert.throws(function() {
      allImagesHaveAltText();
    }, /A11yError/);
  });
});
