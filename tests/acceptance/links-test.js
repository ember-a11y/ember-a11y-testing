/* global checkLinkForMerge, checkLinkHref, checkLinkText, checkLinks */

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

/* checkLinkForMerge */

test('checkLinkForMerge passes when there are no duplicates', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#no-duplicates .test-link')[0];
    assert.ok(checkLinkForMerge(link));
  });
});

test('checkLinkForMerge passes when duplicate links are not next to each other', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#separated-duplicates .test-link')[0];
    assert.ok(checkLinkForMerge(link));
  });
});

test('checkLinkForMerge throws error when duplicate links are next to each other', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#duplicates .test-link')[0];
    assert.throws(() => checkLinkForMerge(link), /A11yError/);
  });
});

/* checkLinkHref */

test('checkLinkHref passes', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#no-duplicates .test-link')[0];
    assert.ok(checkLinkHref(link));
  });
});

test('checkLinkHref throws an error on having just a hash', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#bad-meaning-hash .test-link')[0];
    assert.throws(() => checkLinkHref(link), /A11yError/);
  });
});

test('checkLinkHref throws an error on javascript', function(assert) {
  visit('/links');

  andThen(function() {
    let link = find('#bad-meaning-js .test-link')[0];
    assert.throws(() => checkLinkHref(link), /A11yError/);
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

/* checkLinks */

test('checkLinks passes', function(assert) {
  visit('/links');

  andThen(function() {
    Ember.$('#separated-duplicates').remove();
    Ember.$('#duplicates').remove();
    Ember.$('#bad-meaning-js').remove();
    Ember.$('#bad-meaning-hash').remove();

    assert.ok(checkLinks());
  });
});

test('checkLinks throws an error', function(assert) {
  visit('/links');

  andThen(function() {
    assert.throws(() => checkLinks(), /A11yError/);
  });
});
