import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import violationsHelper from 'ember-a11y-testing/utils/violations-helper';

module('Acceptance | temp test', function (hooks) {
  setupApplicationTest(hooks);

  test('violationsHelper set in the global scope', async function (assert) {
    await visit('/');

    // This number will vary over time as the document updates and the axe-core
    // library changes, therefore we only care that it is finding violations
    assert.ok(
      violationsHelper.count > 0,
      'Violations are found in the violationsHelper'
    );
  });
});
