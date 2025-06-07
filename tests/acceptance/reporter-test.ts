import { module, test } from 'qunit';
import { setupApplicationTest } from '#tests/helpers';
import { visit } from '@ember/test-helpers';
import { a11yAudit, setCustomReporter } from '#src/test-support';

import type { AxeResults } from 'axe-core';

module('reporter', function (hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function () {
    setCustomReporter(); // reset to default value
  });

  test('setCustomReporter can correctly set a custom reporter in favor of default', async function (assert) {
    assert.expect(1);

    setCustomReporter((axeResult: AxeResults) => {
      assert.strictEqual(axeResult.violations.length, 5);
    });

    await visit('/');

    await a11yAudit();
  });
});
