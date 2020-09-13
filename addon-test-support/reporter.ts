import QUnit from 'qunit';
import { AxeResults } from 'axe-core';
import formatViolation from './format-violation';
import { A11yAuditReporter } from './types';
import { storeResults } from './logger';

const DEFAULT_REPORTER = async (results: AxeResults) => {
  let violations = results.violations;

  storeResults(results);

  if (violations.length) {
    let allViolations = violations.map((violation) => {
      let violationNodes = violation.nodes.map((node) => node.html);

      return formatViolation(violation, violationNodes);
    });

    let allViolationMessages = allViolations.join('\n');
    throw new Error(
      `The page should have no accessibility violations. Violations:\n${allViolationMessages}
To rerun this specific failure, use the following query params: &testId=${QUnit.config.current.testId}&enableA11yAudit=true`
    );
  }
};

/**
 * Reports the results of the a11yAudit. Set a custom reporter using `setCustomReporter`.
 */
export let reportA11yAudit: A11yAuditReporter = DEFAULT_REPORTER;

/**
 * Sets a custom reporter, allowing implementers more specific control over how the results of the
 * `a11yAudit` calls are processed. Calling this function with no parameters will reset the reporter
 * to the default reporter.
 *
 * @param customReporter {A11yAuditReporter} The reporter to use in a11yAudit
 */
export function setCustomReporter(
  customReporter: A11yAuditReporter = DEFAULT_REPORTER
) {
  reportA11yAudit = customReporter;
}
