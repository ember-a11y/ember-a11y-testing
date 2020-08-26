import { assert } from '@ember/debug';
import RSVP from 'rsvp';
import {
  run,
  AxeResults,
  RunOptions,
  ElementContext,
  ContextObject,
} from 'axe-core';
import config from 'ember-get-config';
import formatViolation from 'ember-a11y-testing/utils/format-violation';
import violationsHelper from 'ember-a11y-testing/utils/violations-helper';
import { mark, markEndAndMeasure } from './utils';

type MaybeElementContext = ElementContext | RunOptions | undefined;

let _configName = 'ember-a11y-testing';

/**
 * Test only function used to mimic the behavior of when there's no
 * default config
 *
 * @param configName
 * @private
 */
export function _setConfigName(configName = 'ember-a11y-testing') {
  _configName = configName;
}

/**
 * Processes the results of calling axe.a11yCheck. If there are any
 * violations, it throws an error and then logs them individually.
 * @param {Object} results
 * @return {Void}
 */
function processAxeResults(results: AxeResults) {
  let violations = results.violations;

  if (violations.length) {
    let allViolations = [];

    for (let i = 0; i < violations.length; i++) {
      let violation = violations[i];
      let violationNodes = violation.nodes.map((node) => node.html);

      let violationMessage = formatViolation(violation, violationNodes);
      allViolations.push(violationMessage);

      console.error(violationMessage, violation); // eslint-disable-line no-console
      violationsHelper.push(violation);
    }

    let allViolationMessages = allViolations.join('\n');
    throw new Error(
      `The page should have no accessibility violations. Violations:\n${allViolationMessages}`
    );
  }
}

/**
 * Validation function used to determine if we have the shape of an {ElementContext} object.
 *
 * Function mirrors what axe-core uses for internal param validation.
 * https://github.com/dequelabs/axe-core/blob/d5b6931cba857a5c787d912ee56bdd973e3742d4/lib/core/public/run.js#L4
 *
 * @param potential
 */
export function _isContext(potential: MaybeElementContext) {
  'use strict';
  switch (true) {
    case typeof potential === 'string':
    case Array.isArray(potential):
    case self.Node && potential instanceof self.Node:
    case self.NodeList && potential instanceof self.NodeList:
      return true;

    case typeof potential !== 'object':
      return false;

    case (<ContextObject>potential).include !== undefined:
    case (<ContextObject>potential).exclude !== undefined:
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
export function _normalizeRunParams(
  elementContext?: MaybeElementContext,
  runOptions?: RunOptions | undefined
): [ElementContext, RunOptions] {
  let context: ElementContext;
  let options: RunOptions | undefined;

  if (!_isContext(elementContext)) {
    options = <RunOptions>elementContext;
    context = '#ember-testing-container';
  } else {
    context = <ElementContext>elementContext;
    options = runOptions;
  }

  if (typeof options !== 'object') {
    options = config[_configName]?.componentOptions?.axeOptions || {};
  }

  return [context, options!];
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
  contextSelector: MaybeElementContext = '#ember-testing-container',
  axeOptions?: RunOptions | undefined
) {
  mark('a11y_audit_start');

  let [context, options] = _normalizeRunParams(contextSelector, axeOptions);

  document.body.classList.add('axe-running');

  return new RSVP.Promise((resolve, reject) => {
    run(context, options, (error, result) => {
      if (!error) {
        return resolve(result);
      } else {
        return reject(error);
      }
    });
  })
    .then(processAxeResults)
    .finally(() => {
      document.body.classList.remove('axe-running');
      markEndAndMeasure('a11y_audit', 'a11y_audit_start', 'a11y_audit_end');
    });
}
