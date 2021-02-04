import { AxeResults } from 'axe-core';
import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { a11yAudit, setCustomReporter } from 'ember-a11y-testing/test-support';

module('reporter', function (hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function () {
    setCustomReporter(); // reset to default value
  });

  test('setCustomReporter can correctly set a custom reporter in favor of default', async function (assert) {
    assert.expect(1);

    setCustomReporter(async (axeResult: AxeResults) => {
      assert.equal(axeResult.violations.length, 5);
    });

    await visit('/');

    await a11yAudit();
  });
});
