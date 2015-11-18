/* global hasLabel, formHasAllNeededLabels, allFormsHaveLabels */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: form-labels', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

/* hasLabel */

test('hasLabel passes with actual label', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#has-label')[0];
    assert.ok(hasLabel(input));
  });
});

test('hasLabel passes when input has label ancestor', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#input-with-label-ancestor input')[0];
    assert.ok(hasLabel(input));
  });
});

test('hasLabel fails due to no ID', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('[type="password"]')[0];
    assert.throws(function() {
      hasLabel(input);
    }, /has no ID/);
  });
});

test('hasLabel fails due to no label element', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#has-no-label')[0];
    assert.throws(function() {
      hasLabel(input);
    }, /no associated label/);
  });
});

test('hasLabel fails due to no label content', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#has-no-label-content')[0];
    assert.throws(function() {
      hasLabel(input);
    }, /has no content/);
  });
});

/* hasLabel with aria-describedby/aria-labelledby */

test('hasLabel passes with aria-describedby', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#describedby')[0];
    assert.ok(hasLabel(input));
  });
});

test('hasLabel passes with aria-labelledby', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#labelledby')[0];
    assert.ok(hasLabel(input));
  });
});

test('hasLabel passes with multiple IDs in aria-describedby', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#multiple-bys')[0];
    assert.ok(hasLabel(input));
  });
});

test('hasLabel fails with bad ID in aria-labelledby', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#labelledby-bad')[0];
    assert.throws(function() {
      hasLabel(input);
    }, /missing the element it is associated with/);
  });
});

test('hasLabel fails when label is empty', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#labelledby')[0];
    let label = find('#labelledby-test')[0];
    label.innerHTML = '';
    assert.throws(function() {
      hasLabel(input);
    }, /has no content/);
  });
});

test('hasLabel fails with one bad label in when aria-describedby has multiple IDs', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let input = find('#multiple-bys')[0];
    let label = find('#labelledby-test')[0];
    label.innerHTML = '';
    assert.throws(function() {
      hasLabel(input);
    }, /A11yError/);
  });
});

/* hasLabel without having actual labels */

test('hasLabel passes on button with content', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let button = find('#button-empty')[0];
    button.innerHTML = 'filling button';
    assert.ok(hasLabel(button));
  });
});

test('hasLabel fails on button with no content', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let button = find('#button-empty')[0];
    assert.throws(function() {
      hasLabel(button);
    }, /no inner content/);
  });
});

test('hasLabel passes on submit/button with value', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let submit = find('#submit-input')[0];
    submit.value = 'some value';
    assert.ok(hasLabel(submit));

    submit.type = 'button';
    assert.ok(hasLabel(submit));
  });
});

test('hasLabel fails on submit/button with no value', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let submit = find('#submit-input')[0];
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
    let form = find('#passing-form')[0];
    assert.ok(formHasAllNeededLabels(form));
  });
});

test('formHasAllNeededLabels fails', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let form = find('#failing-form')[0];
    assert.throws(function() {
      formHasAllNeededLabels(form);
    }, /A11yError/);
  });
});

/* allFormsHaveLabels */

test('allFormsHaveLabels passes', function(assert) {
  visit('/form-labels');

  andThen(function() {
    let form = find('#failing-form')[0];
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
