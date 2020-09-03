import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';
import {
  setCustomReporter,
  setEnableA11yAudit,
  setupGlobalA11yHooks,
  teardownGlobalA11yHooks,
  _middlewareReporter,
  _TEST_SUITE_RESULTS,
} from 'ember-a11y-testing/test-support';

module('setupMiddlewareReporter', function (hooks) {
  setupApplicationTest(hooks);

  function invokeAll(): boolean {
    return true;
  }

  hooks.beforeEach(function () {
    setCustomReporter(_middlewareReporter);
    setupGlobalA11yHooks(invokeAll);
    setEnableA11yAudit(true);
  });

  hooks.afterEach(function () {
    setCustomReporter();
    teardownGlobalA11yHooks();
    setEnableA11yAudit();
  });

  test('gathers results from failed a11yAudit calls', async function (assert) {
    assert.expect(1);

    await visit('/');

    assert.deepEqual(_TEST_SUITE_RESULTS[0].axeResults.violations.length, 3);
  });
});
