import { assert } from '@ember/debug';
import RSVP from 'rsvp';
import config from 'ember-get-config';
import formatViolation from 'ember-a11y-testing/utils/format-violation';
import violationsHelper from 'ember-a11y-testing/utils/violations-helper';
import { mark, markEndAndMeasure } from './utils';

/**
 * Processes the results of calling axe.a11yCheck. If there are any
 * violations, it throws an error and then logs them individually.
 * @param {Object} results
 * @return {Void}
 */
function a11yAuditCallback(results) {
  let violations = results.violations;

  if (violations.length) {
    let allViolations = [];

    for (let i = 0, l = violations.length; i < l; i++) {
      let violation = violations[i];
      let violationNodes = violation.nodes.map((node) => node.html);

      let violationMessage = formatViolation(violation, violationNodes);
      allViolations.push(violationMessage);

      console.error(violationMessage, violation); // eslint-disable-line no-console
      violationsHelper.push(violation);
    }

    let allViolationMessages = allViolations.join('\n');
    assert(
      `The page should have no accessibility violations. Violations:\n${allViolationMessages}`
    );
  }
}

/**
 * Determines if an object is a plain object (as opposed to a jQuery or other
 * type of object).
 * @param {Object} obj
 * @return {Boolean}
 */
function isPlainObj(obj) {
  return typeof obj == 'object' && obj.constructor == Object;
}

/**
 * Determines whether supplied object contains `include` and `exclude` axe
 * context selector properties. This is necessary to distinguish an axe
 * config object from a context selector object, after a single argument
 * is supplied to `runA11yAudit`.
 * @param {Object} obj
 * @return {Boolean}
 */
function isNotSelectorObj(obj) {
  return (
    !Object.prototype.hasOwnProperty.call(obj, 'include') &&
    !Object.prototype.hasOwnProperty.call(obj, 'exclude')
  );
}

/**
 * Runs the axe a11y audit with the given context selector and options.
 * The context defaults to '#ember-testing-container' if not specified.
 * The options default axe-core defaults.
 *
 * @method runA11yAudit
 * @private
 */
function runA11yAudit(
  contextSelector = '#ember-testing-container',
  axeOptions
) {
  mark('a11y_audit_start');

  // Support passing axeOptions as a single argument
  if (
    arguments.length === 1 &&
    isPlainObj(contextSelector) &&
    isNotSelectorObj(contextSelector)
  ) {
    axeOptions = contextSelector;
    contextSelector = '#ember-testing-container';
  }

  if (!axeOptions) {
    // Try load default config
    let a11yConfig = config['ember-a11y-testing'] || {};
    let componentOptions = a11yConfig['componentOptions'] || {};
    axeOptions = componentOptions['axeOptions'] || {};
  }

  document.body.classList.add('axe-running');

  let auditPromise = new RSVP.Promise((resolve, reject) => {
    axe.run(contextSelector, axeOptions, (error, result) => {
      if (!error) {
        return resolve(result);
      } else {
        return reject(error);
      }
    });
  });

  return auditPromise.then(a11yAuditCallback).finally(() => {
    document.body.classList.remove('axe-running');
    markEndAndMeasure('a11y_audit', 'a11y_audit_start', 'a11y_audit_end');
  });
}

/**
 * A wrapper method to run the async a11yAudit test helper if in an acceptance
 * testing situation, but also supports being used in integration/unit test
 * scenarios.
 *
 * @method a11yAudit
 * @public
 */
export default function a11yAudit(...args) {
  if (window.a11yAudit) {
    return window.a11yAudit(...args);
  }

  return runA11yAudit(...args);
}
