/* global checkDuplicateLinks, checkMeaningfulLinks, checkLinkText */

import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: links', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

/* checkDuplicateLinks */

test('checkDuplicateLinks passes when there are no duplicates', function(assert) {
  visit('/links');

  andThen(function() {
    Ember.$('#separated-duplicates').remove();
    Ember.$('#duplicates').remove();

    assert.ok(checkDuplicateLinks());
  });
});

test('checkDuplicateLinks passes when duplicate links are not next to each other', function(assert) {
  visit('/links');

  andThen(function() {
    Ember.$('#no-duplicates').remove();
    Ember.$('#duplicates').remove();

    assert.ok(checkDuplicateLinks());
  });
});

test('checkDuplicateLinks throws error when duplicate links are next to each other', function(assert) {
  visit('/links');

  andThen(function() {
    Ember.$('#no-duplicates').remove();
    Ember.$('#separated-duplicates').remove();

    assert.throws(() => checkDuplicateLinks(), /A11yError/);
  });
});

/* checkMeaningfulLinks */

test('checkMeaningfulLinks passes', function(assert) {
  visit('/links');

  andThen(function() {
    Ember.$('#bad-meaning-js').remove();
    Ember.$('#bad-meaning-hash').remove();

    assert.ok(checkMeaningfulLinks());
  });
});

test('checkMeaningfulLinks throws an error on having just a hash', function(assert) {
  visit('/links');

  andThen(function() {
    Ember.$('#bad-meaning-js').remove();
    assert.throws(() => checkMeaningfulLinks(), /A11yError/);
  });
});

test('checkMeaningfulLinks throws an error on javascript', function(assert) {
  visit('/links');

  andThen(function() {
    Ember.$('#bad-meaning-hash').remove();
    assert.throws(() => checkMeaningfulLinks(), /A11yError/);
  });
});

/* checkLinkText */

test('checkLinkText passes when link has text inside', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#no-duplicates .test-link')[0];
    assert.ok(checkLinkText(link));
  });
});

test('checkLinkText passes when link has image with alt text inside', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#no-duplicates .test-link')[0];
    link.textContent = '';

    let image = document.createElement('img');
    image.alt = 'some alt';
    link.appendChild(image);

    assert.ok(checkLinkText(link));
  });
});

test('checkLinkText throws error when link is empty', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#no-duplicates .test-link')[0];
    link.textContent = '';

    assert.throws(() => checkLinkText(link), /A11yError/);
  });
});

test('checkLinkText throws error when link has image without alt text', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#no-duplicates .test-link')[0];
    link.textContent = '';

    let image = document.createElement('img');
    image.alt = '';
    link.appendChild(image);

    assert.throws(() => checkLinkText(link), /A11yError/);
  });
});
