/* global hasLabel, formHasAllNeededLabels, allFormsHaveLabels */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: form-labels', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

/* hasLabel */

test('hasLabel passes', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var label = find('#has-label')[0];
    assert.ok(hasLabel(label));
  });
});

test('hasLabel fails due to no ID', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var label = find('[type="password"]')[0];
    assert.throws(function() {
      hasLabel(label);
    }, /has no ID/);
  });
});

test('hasLabel fails due to no label element', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var label = find('#has-no-label')[0];
    assert.throws(function() {
      hasLabel(label);
    }, /has no associated label/);
  });
});

test('hasLabel fails due to no label content', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var label = find('#has-no-label-content')[0];
    assert.throws(function() {
      hasLabel(label);
    }, /has no content/);
  });
});

/* formHasAllNeededLabels */

test('formHasAllNeededLabels passes', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var form = find('#passing-form')[0];
    assert.ok(formHasAllNeededLabels(form));
  });
});

test('formHasAllNeededLabels fails', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var form = find('#failing-form')[0];
    assert.throws(function() {
      formHasAllNeededLabels(form);
    }, /A11yError/);
  });
});

/* allFormsHaveLabels */

test('allFormsHaveLabels passes', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var form = find('#failing-form')[0];
    form.parentNode.removeChild(form);
    assert.ok(allFormsHaveLabels());
  });
});

test('allFormsHaveLabels fails', function(assert) {
  visit('/form-labels');

  andThen(function() {
    assert.throws(function() {
      allFormsHaveLabels();
    }, /A11yError/);
  });
});
