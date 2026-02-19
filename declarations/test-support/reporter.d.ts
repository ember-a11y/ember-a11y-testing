import type { AxeResults } from 'axe-core';
import type { A11yAuditReporter } from './types';
export declare const DEFAULT_REPORTER: (results: AxeResults) => void;
/**
 * Reports the results of the a11yAudit. Set a custom reporter using `setCustomReporter`.
 */
export declare let reportA11yAudit: A11yAuditReporter;
/**
 * Sets a custom reporter, allowing implementers more specific control over how the results of the
 * `a11yAudit` calls are processed. Calling this function with no parameters will reset the reporter
 * to the default reporter.
 *
 * @param customReporter {A11yAuditReporter} The reporter to use in a11yAudit
 */
export declare function setCustomReporter(customReporter?: A11yAuditReporter): void;
//# sourceMappingURL=reporter.d.ts.map