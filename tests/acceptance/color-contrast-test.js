/* global checkTextContrast */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: color-contrast', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('checkTextContrast works for hsl and hsla values', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let normalText = find('#normal-text')[0];
    normalText.style.color = 'hsla(0,0%,0%,1)';
    normalText.style.backgroundColor = 'hsl(255,0%,100%)';
    assert.ok(checkTextContrast(normalText));
  });
});

test('checkTextContrast works for rgb and rgba values', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let normalText = find('#normal-text')[0];
    normalText.style.color = 'rgba(0,0,0,1)';
    normalText.style.backgroundColor = 'rgb(0,0,0)';
    assert.ok(!checkTextContrast(normalText));
  });
});

test('checkTextContrast works for 3 and 6 digit hex values', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let normalText = find('#normal-text')[0];
    normalText.style.color = '#777';
    normalText.style.backgroundColor = '#ffffff';
    assert.ok(!checkTextContrast(normalText));
  });
});
