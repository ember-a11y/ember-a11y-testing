/**
 * Runs the axe a11y audit on the given context selector and with options.
 * The context defaults to '#ember-testing-container' if not specified.
 * The options will fallback to the global axe.ember.testOptions if they're
 * defined and to the default axe-core options after that.
 *
 * @method runA11yAudit
 * @private
 */
function runA11yAudit(contextSelector, auditOptions) {
  let context = contextSelector || '#ember-testing-container';
  let options = auditOptions || axe.ember.testOptions || {};

  return axe.run(context, options).then(axe.ember.a11yCheckCallback);
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
