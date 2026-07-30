import type { InvocationStrategy, AuditFunction } from './types';
export interface GlobalA11yHookOptions {
    helpers: HelperName[];
}
type HelperName = 'blur' | 'click' | 'doubleClick' | 'fillIn' | 'focus' | 'render' | 'scrollTo' | 'select' | 'tab' | 'tap' | 'triggerEvent' | 'triggerKeyEvent' | 'typeIn' | 'visit';
export declare const DEFAULT_A11Y_TEST_HELPER_NAMES: HelperName[];
/**
 * Sets up a11yAudit calls using `@ember/test-helpers`' `registerHook` API.
 *
 * @param shouldAudit Invocation strategy function that determines whether to run the audit helper or not.
 * @param audit Optional audit function used to run the audit. Allows for providing either a11yAudit
 *              or custom audit implementation.
 */
export declare function setupGlobalA11yHooks(shouldAudit: InvocationStrategy): void;
export declare function setupGlobalA11yHooks(shouldAudit: InvocationStrategy, audit: AuditFunction): void;
export declare function setupGlobalA11yHooks(shouldAudit: InvocationStrategy, options: GlobalA11yHookOptions): void;
export declare function setupGlobalA11yHooks(shouldAudit: InvocationStrategy, audit: AuditFunction, options: GlobalA11yHookOptions): void;
/**
 * Function to teardown the configured hooks. Used specifically in testing.
 */
export declare function teardownGlobalA11yHooks(): void;
export {};
//# sourceMappingURL=setup-global-a11y-hooks.d.ts.map