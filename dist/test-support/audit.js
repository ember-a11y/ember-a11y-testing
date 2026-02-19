import "./../a11y-audit.css"
import { run, configure, reset } from 'axe-core';
import { waitForPromise } from '@ember/test-waiters';
import { mark, markEndAndMeasure } from './performance.js';
import { getRunOptions } from './run-options.js';
import { getConfigureOptions } from './configure-options.js';
import { reportA11yAudit } from './reporter.js';

;

/**
 * Validation function used to determine if we have the shape of an {ElementContext} object.
 *
 * Function mirrors what axe-core uses for internal param validation.
 * https://github.com/dequelabs/axe-core/blob/d5b6931cba857a5c787d912ee56bdd973e3742d4/lib/core/public/run.js#L4
 *
 * @param potential
 */
function _isContext(potential) {

  switch (true) {
    case typeof potential === 'string':
    case Array.isArray(potential):
    case self.Node && potential instanceof self.Node:
    case self.NodeList && potential instanceof self.NodeList:
      return true;
    case typeof potential !== 'object':
      return false;
    case potential.include !== undefined:
    case potential.exclude !== undefined:
      return true;
    default:
      return false;
  }
}

/**
 * Normalize the optional params of axe.run()
 *
 * Influenced by https://github.com/dequelabs/axe-core/blob/d5b6931cba857a5c787d912ee56bdd973e3742d4/lib/core/public/run.js#L35
 *
 * @param  elementContext
 * @param  runOptions
 */
function _normalizeRunParams(elementContext, runOptions) {
  let context;
  let options;
  if (!_isContext(elementContext)) {
    options = elementContext;
    context = '#ember-testing-container';
  } else {
    context = elementContext;
    options = runOptions;
  }
  if (typeof options !== 'object') {
    options = getRunOptions() || {};
  }
  return [context, options];
}

/**
 * Runs the axe a11y audit with the given context selector and options.
 *
 * @function a11yAudit
 * @public
 * @param contextSelector A DOM node specifying the context to run the audit in. Defaults to '#ember-testing-container' if not specified.
 * @param axeOptions options to provide to the axe audit. Defaults axe-core defaults.
 */
function a11yAudit(contextSelector = '#ember-testing-container', axeOptions) {
  mark('a11y_audit_start');
  const [context, options] = _normalizeRunParams(contextSelector, axeOptions);
  const configureOptions = getConfigureOptions();
  if (configureOptions) {
    configure(configureOptions);
  }
  document.body.classList.add('axe-running');
  return waitForPromise(run(context, options)).then(reportA11yAudit).finally(() => {
    if (configureOptions) {
      reset();
    }
    document.body.classList.remove('axe-running');
    markEndAndMeasure('a11y_audit', 'a11y_audit_start', 'a11y_audit_end');
  });
}

export { _isContext, _normalizeRunParams, a11yAudit as default };
//# sourceMappingURL=audit.js.map
