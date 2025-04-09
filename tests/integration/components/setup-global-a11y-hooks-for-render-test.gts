import { click, render } from '@ember/test-helpers';
import { DEFAULT_A11Y_TEST_HELPER_NAMES, setEnableA11yAudit, setupGlobalA11yHooks, teardownGlobalA11yHooks } from 'ember-a11y-testing/test-support';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

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
      setupGlobalA11yHooks(invokeAll, a11yAuditFake, {
        helpers: [...DEFAULT_A11Y_TEST_HELPER_NAMES, 'render'],
      });
      setEnableA11yAudit(true);
    });

    hooks.after(function () {
      teardownGlobalA11yHooks();
      setEnableA11yAudit();
    });

    hooks.beforeEach(function () {
      actualAuditInvocationsCount = 0;
    });

    test('it audits on render', async function (assert) {
      await render(<template>
        <button type="button">Hello!</button>
      </template>);
      await click('button');

      assert.strictEqual(
        actualAuditInvocationsCount,
        2,
        'a11yAudit was automatically called twice',
      );
    });
  },
);
