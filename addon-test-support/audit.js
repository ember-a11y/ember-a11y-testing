import RSVP from 'rsvp';

/**
 * Processes the results of calling axe.a11yCheck. If there are any
 * violations, it throws an error and then logs them individually.
 * @param {Object} results
 * @return {Void}
 */
function a11yAuditCallback(results) {
  let violations = results.violations;

  if (violations.length) {
    Ember.Logger.error('ACCESSIBILITY VIOLATIONS: ' + violations.length);

    for (let i = 0, l = violations.length; i < l; i++) {
      let violation = violations[i];
      let violationNodes = violation.nodes.map(node => node.html);

      Ember.Logger.warn(violation.impact.toUpperCase() + ': ' + violation.help);
      Ember.Logger.info('Offending markup (' + violation.nodes.length + ')');
      Ember.Logger.debug(violationNodes);
      Ember.Logger.info('Additional info: ' + violation.helpUrl);
      Ember.Logger.info('-------------------------------------');
    }

    Ember.assert('The page should have no accessibility violations. Please check the developer console for more details.');
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
 * Runs the axe a11y audit with the given context selector and options.
 * The context defaults to '#ember-testing-container' if not specified.
 * The options default axe-core defaults.
 *
 * @method runA11yAudit
 * @private
 */
function runA11yAudit(contextSelector = '#ember-testing-container', auditOptions = {}) {
  // Support passing axeOptions as a single argument
  if (arguments.length === 1 && isPlainObj(contextSelector)) {
    auditOptions = contextSelector;
    contextSelector = '#ember-testing-container';
  }

  document.body.classList.add('axe-running');

  let auditPromise = new RSVP.Promise((resolve, reject) => {
    axe.run(contextSelector, auditOptions, (error, result) => {
      if (!error) {
        return resolve(result);
      } else {
        return reject(error);
      }
    })
  });

  return auditPromise
    .then(a11yAuditCallback)
    .finally(() => document.body.classList.remove('axe-running'));
}

// Register an async helper to use in acceptance tests
Ember.Test.registerAsyncHelper('a11yAudit', function(app, ...args) {
  return runA11yAudit(...args);
});

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
