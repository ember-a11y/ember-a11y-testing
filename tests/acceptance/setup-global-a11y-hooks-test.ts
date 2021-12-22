import QUnit, { module, test } from 'qunit';
import {
  setupGlobalA11yHooks,
  teardownGlobalA11yHooks,
  setEnableA11yAudit,
} from 'ember-a11y-testing/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';
import { InvocationStrategy } from 'ember-a11y-testing/test-support/types';

function getRange(count: number) {
  return Array(count)
    .fill(0)
    .map((_, i) => i + 1);
}

function getTestName(n: number, count: number, invocationStrategy: string) {
  return n === count
    ? `it invokes correctly using ${invocationStrategy} invocation strategy`
    : `IGNORE: test used to validate setupGlobalA11yHooks (${n})`;
}

module('setupGlobalA11yHooks with invokeAll', function (hooks) {
  setupApplicationTest(hooks);

  const TEST_INVOCATIONS_COUNT = 6;
  const EXPECTED_AUDIT_INVOCATIONS_COUNT = 6;
  let actualAuditInvocationsCount = 0;
  let numInvoked = 0;

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

  getRange(TEST_INVOCATIONS_COUNT).forEach((num) => {
    test(
      getTestName(num, TEST_INVOCATIONS_COUNT, 'invokeAll'),
      async function (assert) {
        assert.expect(0);

        await visit('/');

        numInvoked++;

        if (numInvoked === TEST_INVOCATIONS_COUNT) {
          assert.expect(1);
          // eslint-disable-next-line qunit/no-conditional-assertions
          assert.strictEqual(
            actualAuditInvocationsCount,
            EXPECTED_AUDIT_INVOCATIONS_COUNT
          );
        }
      }
    );
  });
});

module('setupGlobalA11yHooks with invokeEveryN', function (hooks) {
  setupApplicationTest(hooks);

  const TEST_INVOCATIONS_COUNT = 6;
  const EXPECTED_AUDIT_INVOCATIONS_COUNT = 2;
  let actualAuditInvocationsCount = 0;
  let numInvoked = 0;

  function invokeEveryN(interval: number): InvocationStrategy {
    let invocationCounter: number = 0;

    return () => {
      invocationCounter++;

      return invocationCounter % interval === 0;
    };
  }

  async function a11yAuditFake() {
    actualAuditInvocationsCount += 1;
  }

  hooks.before(function () {
    setupGlobalA11yHooks(invokeEveryN(3), a11yAuditFake);
    setEnableA11yAudit(true);
  });

  hooks.after(function () {
    teardownGlobalA11yHooks();
    setEnableA11yAudit();
  });

  getRange(TEST_INVOCATIONS_COUNT).forEach((num) => {
    test(
      getTestName(num, TEST_INVOCATIONS_COUNT, 'invokeEveryN'),
      async function (assert) {
        assert.expect(0);

        await visit('/');

        numInvoked++;

        if (numInvoked === TEST_INVOCATIONS_COUNT) {
          assert.expect(1);
          // eslint-disable-next-line qunit/no-conditional-assertions
          assert.strictEqual(
            actualAuditInvocationsCount,
            EXPECTED_AUDIT_INVOCATIONS_COUNT
          );
        }
      }
    );
  });
});

module('setupGlobalA11yHooks with invokeWithExclusions', function (hooks) {
  setupApplicationTest(hooks);

  const TEST_INVOCATIONS_COUNT = 6;
  let actualTestsRun: string[] = [];
  let numInvoked = 0;

  function invokeWithExclusions(): boolean {
    const EXCLUDED_TESTS = [
      'IGNORE: test used to validate setupGlobalA11yHooks (2)',
      'it invokes correctly using invokeWithExclusions invocation strategy',
    ];

    return !EXCLUDED_TESTS.includes(QUnit.config.current.testName);
  }

  async function a11yAuditFake() {
    actualTestsRun.push(QUnit.config.current.testName);
  }

  hooks.before(function () {
    setupGlobalA11yHooks(invokeWithExclusions, a11yAuditFake);
    setEnableA11yAudit(true);
  });

  hooks.after(function () {
    teardownGlobalA11yHooks();
    setEnableA11yAudit();
  });

  getRange(TEST_INVOCATIONS_COUNT).forEach((num) => {
    test(
      getTestName(num, TEST_INVOCATIONS_COUNT, 'invokeWithExclusions'),
      async function (assert) {
        assert.expect(0);

        await visit('/');

        numInvoked++;

        if (numInvoked === TEST_INVOCATIONS_COUNT) {
          assert.expect(1);
          // eslint-disable-next-line qunit/no-conditional-assertions
          assert.deepEqual(actualTestsRun, [
            'IGNORE: test used to validate setupGlobalA11yHooks (1)',
            'IGNORE: test used to validate setupGlobalA11yHooks (3)',
            'IGNORE: test used to validate setupGlobalA11yHooks (4)',
            'IGNORE: test used to validate setupGlobalA11yHooks (5)',
          ]);
        }
      }
    );
  });
});
