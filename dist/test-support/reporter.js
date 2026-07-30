import QUnit from 'qunit';
import formatViolation from './format-violation.js';
import { storeResults } from './logger.js';

const DEFAULT_REPORTER = results => {
  const violations = results.violations;
  storeResults(results);
  if (violations.length) {
    const allViolations = violations.map(violation => {
      const violationNodes = violation.nodes.map(node => node.html);
      return formatViolation(violation, violationNodes);
    });
    const allViolationMessages = allViolations.join('\n');
    throw new Error(`The page should have no accessibility violations. Violations:\n${allViolationMessages}
To rerun this specific failure, use the following query params: &testId=${QUnit.config.current.testId}&enableA11yAudit=true`);
  }
};

/**
 * Reports the results of the a11yAudit. Set a custom reporter using `setCustomReporter`.
 */
let reportA11yAudit = DEFAULT_REPORTER;

/**
 * Sets a custom reporter, allowing implementers more specific control over how the results of the
 * `a11yAudit` calls are processed. Calling this function with no parameters will reset the reporter
 * to the default reporter.
 *
 * @param customReporter {A11yAuditReporter} The reporter to use in a11yAudit
 */
function setCustomReporter(customReporter = DEFAULT_REPORTER) {
  reportA11yAudit = customReporter;
}

export { DEFAULT_REPORTER, reportA11yAudit, setCustomReporter };
//# sourceMappingURL=reporter.js.map
