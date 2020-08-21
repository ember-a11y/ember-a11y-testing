import { assert } from '@ember/debug';
import RSVP from 'rsvp';
import { run, AxeResults, RunOptions, ElementContext } from 'axe-core';
import config from 'ember-get-config';
import formatViolation from 'ember-a11y-testing/utils/format-violation';
import violationsHelper from 'ember-a11y-testing/utils/violations-helper';
import { mark, markEndAndMeasure } from './utils';

type MaybeContextObject = ElementContext | RunOptions | undefined;

/**
 * Processes the results of calling axe.a11yCheck. If there are any
 * violations, it throws an error and then logs them individually.
 * @param {Object} results
 * @return {Void}
 */
function a11yAuditCallback(results: AxeResults) {
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
function isPlainObj(obj: MaybeContextObject) {
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
function isNotContextObject(obj: MaybeContextObject) {
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
export default function a11yAudit(
  contextSelector:
    | ElementContext
    | RunOptions
    | undefined = '#ember-testing-container',
  axeOptions?: RunOptions | undefined
) {
  mark('a11y_audit_start');

  let context: ElementContext;
  let options: RunOptions | undefined = axeOptions;

  // Support passing axeOptions as a single argument
  if (arguments.length === 1) {
    if (isPlainObj(contextSelector) && isNotContextObject(contextSelector)) {
      context = '#ember-testing-container';
      options = <RunOptions>contextSelector;
    } else {
      context = <ElementContext>contextSelector;
    }
  } else {
    context = <ElementContext>contextSelector;
  }

  if (!options) {
    // Try load default config
    let a11yConfig = config['ember-a11y-testing'] || {};
    let componentOptions = a11yConfig['componentOptions'] || {};
    options = componentOptions['axeOptions'] || {};
  }

  document.body.classList.add('axe-running');

  let auditPromise = new RSVP.Promise((resolve, reject) => {
    run(context, options!, (error, result) => {
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
