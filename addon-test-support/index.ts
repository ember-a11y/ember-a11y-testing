export { default as a11yAudit } from './audit';
export { default as a11yAuditIf } from './audit-if';
export { setRunOptions, getRunOptions } from './run-options';
export { setEnableA11yAudit, shouldForceAudit } from './should-force-audit';
export {
  setupGlobalA11yHooks,
  teardownGlobalA11yHooks,
} from './setup-global-a11y-hooks';
export { setCustomReporter } from './reporter';

export { InvocationStrategy, A11yAuditReporter } from './types';
