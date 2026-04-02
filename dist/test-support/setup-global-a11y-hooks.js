import { registerHook } from '@ember/test-helpers';
import { getRunOptions } from './run-options.js';
import a11yAudit from './audit.js';
import { shouldForceAudit } from './should-force-audit.js';

const _unregisterHooks = [];
const DEFAULT_A11Y_TEST_HELPER_NAMES = ['visit', 'click', 'doubleClick', 'tap'];

/**
 * Sets up a11yAudit calls using `@ember/test-helpers`' `registerHook` API.
 *
 * @param shouldAudit Invocation strategy function that determines whether to run the audit helper or not.
 * @param audit Optional audit function used to run the audit. Allows for providing either a11yAudit
 *              or custom audit implementation.
 */

function setupGlobalA11yHooks(shouldAudit, auditOrOptions, options) {
  let audit = a11yAudit;
  if (typeof auditOrOptions === 'function') {
    audit = auditOrOptions;
  } else {
    options = auditOrOptions;
  }
  const helpers = options?.helpers ?? DEFAULT_A11Y_TEST_HELPER_NAMES;
  helpers.forEach(helperName => {
    const hook = registerHook(helperName, 'end', async () => {
      if (shouldForceAudit() && shouldAudit(helperName, 'end')) {
        await audit(getRunOptions());
      }
    });
    _unregisterHooks.push(hook);
  });
}

/**
 * Function to teardown the configured hooks. Used specifically in testing.
 */
function teardownGlobalA11yHooks() {
  while (_unregisterHooks.length) {
    const hook = _unregisterHooks.shift();
    hook.unregister();
  }
}

export { DEFAULT_A11Y_TEST_HELPER_NAMES, setupGlobalA11yHooks, teardownGlobalA11yHooks };
//# sourceMappingURL=setup-global-a11y-hooks.js.map
