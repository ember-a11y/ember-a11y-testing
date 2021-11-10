import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  setupGlobalA11yHooks,
  teardownGlobalA11yHooks,
  setEnableA11yAudit,
} from 'ember-a11y-testing/test-support';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module(
  'Integration | Component | setup-global-a11y-hooks-test',
  function (hooks) {
    setupRenderingTest(hooks);

    let actualAuditInvocationsCount = 0;

    function invokeAll(): boolean {
      return true;
    }

    async function a11yAuditFake() {
      actualAuditInvocationsCount += 1;
    }

    hooks.before(function () {
      setupGlobalA11yHooks(invokeAll, a11yAuditFake);
      setEnableA11yAudit(true);
    });

    hooks.after(function () {
      teardownGlobalA11yHooks();
      setEnableA11yAudit();
    });

    test('it audits on render', async function (assert) {
      await render(hbs`
        <button type="button">Hello!</button>
      `);
      await click('button');

      // We expect three invocations because setupRenderingTest performs an
      // initial render. This is OK, because that initial render is empty and
      // therefore should not contain any a11y violations.
      assert.equal(
        actualAuditInvocationsCount,
        3,
        'a11yAudit was automatically called three times'
      );
    });
  }
);
