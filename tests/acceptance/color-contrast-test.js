/* global checkTextContrast */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;
let warnSpy;

module('Acceptance: color-contrast', {
  beforeEach: function() {
    application = startApp();
    warnSpy = sinon.spy(console, 'warn');
  },

  afterEach: function() {
    warnSpy.restore();
    Ember.run(application, 'destroy');
  }
});

/* checkTextContrast */

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
    normalText.style.backgroundColor = 'rgb(255,255,255)';
    assert.ok(checkTextContrast(normalText));
  });
});

test('checkTextContrast works for 3 and 6 digit hex values', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let normalText = find('#normal-text')[0];
    normalText.style.color = '#555';
    normalText.style.backgroundColor = '#ffffff';
    assert.ok(checkTextContrast(normalText));
  });
});

test('checkTextContrast enforces different levels of conformance', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let normalText = find('#normal-text')[0];
    normalText.style.color = '#666';
    normalText.style.backgroundColor = '#fff';
    assert.ok(checkTextContrast(normalText, normalText, 'AA'));
    assert.throws(() => checkTextContrast(normalText, normalText, 'AAA'), /lower than expected/);
  });
});

test('checkTextContrast enforces different ratios depending on text size', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let normalText = find('#normal-text')[0];
    normalText.style.color = '#888';
    normalText.style.backgroundColor = '#fff';

    let largeText = find('#large-scale-text')[0];
    largeText.style.color = '#888';
    largeText.style.backgroundColor = '#fff';

    assert.throws(() => checkTextContrast(normalText), /lower than expected/);
    assert.ok(checkTextContrast(largeText));
  });
});

test('checkTextContrast enforces different ratios depending on font weight', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let normalText = find('#normal-text')[0];
    normalText.style.color = '#888';
    normalText.style.backgroundColor = '#fff';
    assert.throws(() => checkTextContrast(normalText), /lower than expected/);

    normalText.style.fontWeight = 'bold';
    assert.ok(checkTextContrast(normalText));

    normalText.style.fontWeight = '500';
    assert.ok(checkTextContrast(normalText));

    normalText.style.fontSize = '12px';
    assert.throws(() => checkTextContrast(normalText), /lower than expected/);
  });
});

test('checkTextContrast works with a different element passed in for background', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let text = find('#container-text')[0];
    text.style.color = '#000';

    let container = find('#container')[0];
    container.style.backgroundColor = '#000';

    assert.throws(() => checkTextContrast(text, container), /lower than expected/);

    container.style.backgroundColor = '#fff';
    assert.ok(checkTextContrast(text, container));

    text.style.color = '#fff';
    container.style.backgroundColor = '#000';
    assert.ok(checkTextContrast(text, container));
  });
});

test('checkTextContrast warns about using alpha values', function(assert) {
  visit('/color-contrast');

  andThen(function() {
    let normalText = find('#normal-text')[0];
    normalText.style.color = 'hsla(0,0%,0%,0.7)';
    normalText.style.backgroundColor = 'hsl(255,0%,100%)';
    checkTextContrast(normalText);

    assert.ok(warnSpy.calledOnce);
  });
});
