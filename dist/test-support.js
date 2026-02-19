export { default as a11yAudit } from './test-support/audit.js';
export { getRunOptions, setRunOptions } from './test-support/run-options.js';
export { getConfigureOptions, setConfigureOptions } from './test-support/configure-options.js';
export { setEnableA11yAudit, shouldForceAudit } from './test-support/should-force-audit.js';
export { useMiddlewareReporter } from './test-support/use-middleware-reporter.js';
export { DEFAULT_A11Y_TEST_HELPER_NAMES, setupGlobalA11yHooks, teardownGlobalA11yHooks } from './test-support/setup-global-a11y-hooks.js';
export { DEFAULT_REPORTER as _DEFAULT_REPORTER, setCustomReporter } from './test-support/reporter.js';
export { TEST_SUITE_RESULTS as _TEST_SUITE_RESULTS, middlewareReporter as _middlewareReporter, pushTestResult as _pushTestResult, setupMiddlewareReporter } from './test-support/setup-middleware-reporter.js';
export { printResults, storeResults } from './test-support/logger.js';
export { setupConsoleLogger } from './test-support/setup-console-logger.js';
export { setupQUnitA11yAuditToggle } from './test-support/setup-qunit.js';
//# sourceMappingURL=test-support.js.map
