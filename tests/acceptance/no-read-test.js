import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: no-read', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

/* checkAriaHidden */

test('checkAriaHidden should pass with content', function(assert) {
  visit('/no-read');

  andThen(function() {
    var noAria = find('#no-aria')[0];
    assert.ok(checkAriaHidden(noAria));
  });
});

test('checkAriaHidden should fail with no content', function(assert) {
  visit('/no-read');

  andThen(function() {
    var noAria = find('#no-aria')[0];
    noAria.innerHTML = '';
    assert.throws(function() {
      checkAriaHidden(noAria);
    }, /no content/);
  });
});

test('checkAriaHidden should pass with no visibility', function(assert) {
  visit('/no-read');

  andThen(function() {
    var noAria = find('#no-aria')[0];
    noAria.innerHTML = '';
    noAria.style.display = 'none';
    assert.ok(checkAriaHidden(noAria));
  });
});

test('checkAriaHidden should pass with aria-hidden=true', function(assert) {
  visit('/no-read');

  andThen(function() {
    var hasAriaHidden = find('#has-aria')[0];
    assert.ok(checkAriaHidden(hasAriaHidden));
  });
});

test('checkAriaHidden should fail with aria-hidden=false', function(assert) {
  visit('/no-read');

  andThen(function() {
    var hasAriaHidden = find('#has-aria')[0];
    hasAriaHidden.setAttribute('aria-hidden', 'false');
    assert.throws(function() {
      checkAriaHidden(hasAriaHidden);
    }, /no content yet/);
  });
});

/* checkForHidden */

test('checkForHidden passes', function(assert) {
  visit('/no-read');

  andThen(function() {
    assert.ok(checkForHidden());
  });
});

test('checkForHidden fails', function(assert) {
  visit('/no-read');

  andThen(function() {
    var hasAriaHidden = find('#has-aria')[0];
    hasAriaHidden.setAttribute('aria-hidden', 'false');
    assert.throws(function() {
      checkForHidden()
    }, /A11yError/);
  });
});
