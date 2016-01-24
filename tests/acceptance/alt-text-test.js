/* global hasAltText, allImagesHaveAltText, allNonTextElementsHaveAltText */

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
    let altText = find('#img-alt-text')[0];
    assert.ok(hasAltText(altText));
  });
});

test('hasAltText passes for empty alt attribute', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let altText = find('#img-empty-alt-text')[0];
    assert.ok(hasAltText(altText));
  });
});

test('hasAltText passes with aria-hidden', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let ariaHidden = find('#img-aria-hidden')[0];
    assert.ok(hasAltText(ariaHidden));
  });
});

test('hasAltText passes with presentation role', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let presentationRole = find('#img-presentation')[0];
    assert.ok(hasAltText(presentationRole));
  });
});

test('hasAltText throws error', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let noAltText = find('#img-no-alt-text')[0];
    assert.throws(function() {
      hasAltText(noAltText);
    }, /A11yError/);
  });
});

test('allImagesHaveAltText passes', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let noAltText = find('#img-no-alt-text')[0];
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

test('allNonTextElementsHaveAltText passes', function(assert) {
  visit('/alt-text');

  andThen(function() {
    let noAltText = find('#img-no-alt-text, #audio-no-alt-text, #embed-no-alt-text, #object-no-alt-text, #video-no-alt-text, #canvas-no-alt-text');
    for (let i = 0, l = noAltText.length; i < l; i++) {
      noAltText[i].setAttribute('alt', 'has alt now');
    }
    assert.ok(allImagesHaveAltText());
  });
});

test('allNonTextElementsHaveAltText throws error', function(assert) {
  visit('/alt-text');

  andThen(function() {
    assert.throws(function() {
      allNonTextElementsHaveAltText();
    }, /A11yError/);
  });
});
