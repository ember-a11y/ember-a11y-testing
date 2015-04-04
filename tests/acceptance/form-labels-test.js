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

/* hasLabel without having actual labels */

test('hasLabel passs on button with content', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var button = find('#button-empty')[0];
    button.innerHTML = 'filling button';
    assert.ok(hasLabel(button));
  });
});

test('hasLabel fails on button with no content', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var button = find('#button-empty')[0];
    assert.throws(function() {
      hasLabel(button);
    }, /no inner content/);
  });
});

test('hasLabel passes on submit/button with value', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var submit = find('#submit-input')[0];
    submit.value = 'some value';
    assert.ok(hasLabel(submit));

    submit.type = 'button';
    assert.ok(hasLabel(submit));
  });
});

test('hasLabel fails on submit/button with no value', function(assert) {
  visit('/form-labels');

  andThen(function() {
    var submit = find('#submit-input')[0];
    assert.throws(function() {
      hasLabel(submit);
    }, /no value and is a submit/);

    submit.type = 'button';
    assert.throws(function() {
      hasLabel(submit);
    }, /no value and is a button/);
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
