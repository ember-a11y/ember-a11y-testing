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

test('checkTextContrast returns 21', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let normalText = find('#normal-text')[0];
    normalText.style.color = 'hsla(200,0%,0%,.7)';
    normalText.style.backgroundColor = 'hsla(200,0%,0%,.7)';
    assert.ok(checkTextContrast(normalText));
  });
});
