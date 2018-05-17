import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import visitAndAudit from 'ember-a11y-testing/test-support/visit-and-audit';

module('Acceptance | visit-and-audit', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    run(this.application, 'destroy');
  }
});

test('visitAndAudit should visit and audit a page', function(assert) {
  let expectedErrorMessage = "Assertion Failed: The page should have no accessibility violations. Please check the developer console for more details.";
  visitAndAudit('/').then(() => {
    assert.ok(false, 'audit was not run');
  }).catch((error) => {
    assert.equal(error.message, expectedErrorMessage);
  });
});
