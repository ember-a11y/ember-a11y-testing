/* global checkAriaHidden, checkForNoRead */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;
let warnSpy;

module('Acceptance: no-read', {
  beforeEach: function() {
    application = startApp();
    warnSpy = sinon.spy(console, 'warn');
  },

  afterEach: function() {
    warnSpy.restore();
    Ember.run(application, 'destroy');
  }
});

/* checkAriaHidden */

test('checkAriaHidden should pass with content', function(assert) {
  visit('/no-read');

  andThen(function() {
    let noAria = find('#no-aria')[0];
    assert.ok(checkAriaHidden(noAria));
    assert.ok(warnSpy.notCalled);
  });
});

test('checkAriaHidden should warn with no content', function(assert) {
  visit('/no-read');

  andThen(function() {
    let noAria = find('#no-aria')[0];
    noAria.innerHTML = '';
    checkAriaHidden(noAria);
    assert.ok(warnSpy.calledOnce);
  });
});

test('checkAriaHidden should pass with no visibility', function(assert) {
  visit('/no-read');

  andThen(function() {
    let noAria = find('#no-aria')[0];
    noAria.innerHTML = '';
    noAria.style.display = 'none';
    assert.ok(checkAriaHidden(noAria));
    assert.ok(warnSpy.notCalled);
  });
});

test('checkAriaHidden should pass with aria-hidden=true', function(assert) {
  visit('/no-read');

  andThen(function() {
    let hasAriaHidden = find('#has-aria')[0];
    assert.ok(checkAriaHidden(hasAriaHidden));
    assert.ok(warnSpy.notCalled);
  });
});

test('checkAriaHidden should warn with aria-hidden=false', function(assert) {
  visit('/no-read');

  andThen(function() {
    let hasAriaHidden = find('#has-aria')[0];
    hasAriaHidden.setAttribute('aria-hidden', 'false');
    checkAriaHidden(hasAriaHidden);
    assert.ok(warnSpy.calledOnce);
  });
});

test('checkAriaHidden should throw error when throwError=true', function(assert) {
  visit('/no-read');

  andThen(function() {
    let noAria = find('#no-aria')[0];
    noAria.innerHTML = '';
    assert.throws(function() {
      checkAriaHidden(noAria, true);
    }, /A11yError/);
    assert.ok(warnSpy.notCalled);
  });
});

/* checkForNoRead */

test('checkForNoRead passes', function(assert) {
  visit('/no-read');

  andThen(function() {
    assert.ok(checkForNoRead());
  });
});

test('checkForNoRead warns', function(assert) {
  visit('/no-read');

  andThen(function() {
    let hasAriaHidden = find('#has-aria')[0];
    hasAriaHidden.setAttribute('aria-hidden', 'false');
    checkForNoRead();
    assert.ok(warnSpy.calledOnce);
  });
});

test('checkForNoRead throws errors when throwErrors=true', function(assert) {
  visit('/no-read');

  andThen(function() {
    let hasAriaHidden = find('#has-aria')[0];
    hasAriaHidden.setAttribute('aria-hidden', 'false');
    assert.throws(function() {
      checkForNoRead('throwErrors');
    }, /A11yError/);
  });
});
