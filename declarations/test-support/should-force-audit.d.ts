export declare function _calculateUpdatedHref(href: string, baseURI: string, enabled?: boolean): string;
export declare function setEnableA11yAudit(enabled?: boolean): void;
/**
 * Forces running audits. This functionality is enabled by
 * the presence of an `enableA11yAudit` query parameter passed to the test suite
 * or the `ENABLE_A11Y_AUDIT` environment variable.
 *
 * If used with `setupGlobalA11yHooks` and the query param enabled, this will override
 * any `InvocationStrategy` passed to that function and force the audit.
 */
export declare function shouldForceAudit(): boolean;
//# sourceMappingURL=should-force-audit.d.ts.map