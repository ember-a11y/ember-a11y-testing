import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

const { run } = Ember;

const SELECTORS = {
  passingComponent: '[data-test-selector="violations-page__passing-component"]',
  failingComponent: '[data-test-selector="empty-button"]'
};

module('Acceptance | a11y-audit', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    run(this.application, 'destroy');
  }
});

test('a11yAudit should catch violations as an async helper', function(assert) {
  visit('/');

  // Since we have `catch` blocks, we need to return these promises to ensure
  // QUnit waits the whole time(you shouldn't do this normally).
  return a11yAudit().then(() => {
    assert.ok(false, 'a11yAudit should have thrown an error on violations');
  }).catch((e) => {
    assert.strictEqual(e.message, 'Assertion Failed: The page should have no accessibility violations. Please check the developer console for more details.');
  });
});

test('a11yAudit should properly scope to a specified context selector', function(assert) {
  visit('/');

  a11yAudit(SELECTORS.passingComponent).then(() => {
    assert.ok(true, 'a11yAudit should not have discovered any issues');
  });

  // Since we have `catch` blocks, we need to return these promises to ensure
  // QUnit waits the whole time(you shouldn't do this normally).
  return a11yAudit(SELECTORS.failingComponent).then(() => {
    assert.ok(false, 'a11yAudit should have thrown an error on violations');
  }).catch((e) => {
    assert.strictEqual(e.message, 'Assertion Failed: The page should have no accessibility violations. Please check the developer console for more details.', 'error message is correct');
  });
});

test('a11yAudit can accept an options hash in addition to context', function(assert) {
  visit('/');

  a11yAudit(SELECTORS.failingComponent, {
    rules: {
      'button-name': {
        enabled: false
      }
    }
  });

  andThen(() => {
    assert.ok(true, 'no errors should have been found in a11yAudit');
  });
});
