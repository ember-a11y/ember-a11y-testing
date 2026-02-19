import { registerHook } from '@ember/test-helpers';
import { getRunOptions } from './run-options.ts';
import a11yAudit from './audit.ts';
import { shouldForceAudit } from './should-force-audit.ts';

import type { HookUnregister } from '@ember/test-helpers';
import type { InvocationStrategy, AuditFunction } from './types';

export interface GlobalA11yHookOptions {
  helpers: HelperName[];
}

type HelperName =
  | 'blur'
  | 'click'
  | 'doubleClick'
  | 'fillIn'
  | 'focus'
  | 'render'
  | 'scrollTo'
  | 'select'
  | 'tab'
  | 'tap'
  | 'triggerEvent'
  | 'triggerKeyEvent'
  | 'typeIn'
  | 'visit';

const _unregisterHooks: HookUnregister[] = [];

export const DEFAULT_A11Y_TEST_HELPER_NAMES: HelperName[] = [
  'visit',
  'click',
  'doubleClick',
  'tap',
];

/**
 * Sets up a11yAudit calls using `@ember/test-helpers`' `registerHook` API.
 *
 * @param shouldAudit Invocation strategy function that determines whether to run the audit helper or not.
 * @param audit Optional audit function used to run the audit. Allows for providing either a11yAudit
 *              or custom audit implementation.
 */
export function setupGlobalA11yHooks(shouldAudit: InvocationStrategy): void;
export function setupGlobalA11yHooks(
  shouldAudit: InvocationStrategy,
  audit: AuditFunction,
): void;
export function setupGlobalA11yHooks(
  shouldAudit: InvocationStrategy,
  options: GlobalA11yHookOptions,
): void;
export function setupGlobalA11yHooks(
  shouldAudit: InvocationStrategy,
  audit: AuditFunction,
  options: GlobalA11yHookOptions,
): void;
export function setupGlobalA11yHooks(
  shouldAudit: InvocationStrategy,
  auditOrOptions?: AuditFunction | GlobalA11yHookOptions,
  options?: GlobalA11yHookOptions,
): void {
  let audit: AuditFunction = a11yAudit;

  if (typeof auditOrOptions === 'function') {
    audit = auditOrOptions;
  } else {
    options = auditOrOptions;
  }

  const helpers = options?.helpers ?? DEFAULT_A11Y_TEST_HELPER_NAMES;

  helpers.forEach((helperName) => {
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
export function teardownGlobalA11yHooks() {
  while (_unregisterHooks.length) {
    const hook = _unregisterHooks.shift()!;
    hook.unregister();
  }
}
