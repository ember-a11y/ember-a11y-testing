export { default as a11yAudit } from './test-support/audit.ts';
export { setRunOptions, getRunOptions } from './test-support/run-options.ts';
export {
  setConfigureOptions,
  getConfigureOptions,
} from './test-support/configure-options.ts';
export {
  setEnableA11yAudit,
  shouldForceAudit,
} from './test-support/should-force-audit.ts';
export { useMiddlewareReporter } from './test-support/use-middleware-reporter.ts';
export {
  setupGlobalA11yHooks,
  teardownGlobalA11yHooks,
  DEFAULT_A11Y_TEST_HELPER_NAMES,
} from './test-support/setup-global-a11y-hooks.ts';
export {
  setCustomReporter,
  DEFAULT_REPORTER as _DEFAULT_REPORTER,
} from './test-support/reporter.ts';
export {
  TEST_SUITE_RESULTS as _TEST_SUITE_RESULTS,
  middlewareReporter as _middlewareReporter,
  pushTestResult as _pushTestResult,
  setupMiddlewareReporter,
} from './test-support/setup-middleware-reporter.ts';
export { storeResults, printResults } from './test-support/logger.ts';
export { setupConsoleLogger } from './test-support/setup-console-logger.ts';
export { setupQUnitA11yAuditToggle } from './test-support/setup-qunit.ts';

export type {
  InvocationStrategy,
  A11yAuditReporter,
} from './test-support/types/index';
