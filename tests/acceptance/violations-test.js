import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import violationsHelper from 'ember-a11y-testing/utils/violations-helper';

moduleForAcceptance('Acceptance | violations', {
  beforeEach() {
    // In order for the audit to run, we have to act like we're not in testing
    Ember.testing = false;
  },

  afterEach() {
    // Reset everything to ensure validity of other tests
    Ember.testing = true;
  }
});

test('violationsHelper set in the global scope', function(assert) {
  visit('/');

  andThen(() => {
    // This number will vary over time as the document updates and the axe-core
    // library changes, therefore we only care that it is finding violations
    assert.ok(violationsHelper.count > 0, 'Violations are found in the violationsHelper');
  });
});
