import { _registerHook, HookUnregister } from '@ember/test-helpers';
import { InvocationStrategy } from './types';
import { getRunOptions } from './run-options';
import a11yAudit from './audit';
import { shouldForceAudit } from './should-force-audit';

let _unregisterHooks: HookUnregister[] = [];

/**
 * Sets up a11yAudit calls using `@ember/test-helpers`' `_registerHook` API.
 *
 * @param shouldAudit Invocation strategy function that determines whether to run the audit helper or not.
 * @param audit Optional audit function used to run the audit. Allows for providing either a11yAudit, a11yAuditIf,
 *              or custom audit implementation.
 */
export function setupGlobalA11yHooks(
  shouldAudit: InvocationStrategy,
  audit: (...args: any[]) => PromiseLike<void> = a11yAudit
) {
  ['visit', 'click', 'doubleClick', 'tap'].forEach((helperName) => {
    let hook = _registerHook(helperName, 'end', async () => {
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
export function teardownGlobalA11yHooks() {
  while (_unregisterHooks.length) {
    let hook = _unregisterHooks.shift()!;
    hook.unregister();
  }
}
