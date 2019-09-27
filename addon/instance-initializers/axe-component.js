import { assert } from '@ember/debug';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import { isArray } from '@ember/array';
import { scheduleOnce } from '@ember/runloop';
import Ember from 'ember';
import isBackgroundReplacedElement from 'ember-a11y-testing/utils/is-background-replaced-element';
import formatViolation from 'ember-a11y-testing/utils/format-violation';
import violationsHelper from 'ember-a11y-testing/utils/violations-helper';
import concurrentAxe from 'ember-a11y-testing/utils/concurrent-axe';

// The following instance initializer augments the base component class to enable component self auditing during (re)render.
// This visual component audit mechanism is exclusively used during development and does not get invoked when executing tests.

const VIOLATION_CLASS__LEVEL_1 = 'axe-violation--level-1';
const VIOLATION_CLASS__LEVEL_2 = 'axe-violation--level-2';
const VIOLATION_CLASS__LEVEL_3 = 'axe-violation--level-3';
const VIOLATION_CLASS__REPLACED = 'axe-violation--replaced-element';

/*
 * Mapping of violation class names to their corresponding `visualNoiseLevel`
 */
const VIOLATION_CLASS_MAP = {
  LEVEL_1: VIOLATION_CLASS__LEVEL_1,
  LEVEL_2: VIOLATION_CLASS__LEVEL_2,
  LEVEL_3: VIOLATION_CLASS__LEVEL_3,
  REPLACED_ELEMENT: VIOLATION_CLASS__REPLACED
};

const VIOLATION_CLASS_NAMES = Object.keys(VIOLATION_CLASS_MAP).map(key => VIOLATION_CLASS_MAP[key]);

/**
 * Variable to ensure that the initializer is only ran once. Though in this
 * particular case, running more than once shouldn't cause side-effects.
 * @type {Boolean}
 */
let hasRan = false;

export function initialize(appInstance) {
  if (hasRan) { return; }

  const ENV = appInstance.resolveRegistration('config:environment');
  const addonConfig = ENV['ember-a11y-testing'] || {};
  const { componentOptions = {} } = addonConfig;

  const {
    turnAuditOff: configuredTurnAuditOff,
    excludeAxeCore = false,
    axeOptions = {},
    axeCallback,
    visualNoiseLevel: configuredVisualNoiseLevel,
    axeViolationClassNames: configuredAxeViolationClassNames
  } = componentOptions;

  let visualNoiseLevel = configuredVisualNoiseLevel ? configuredVisualNoiseLevel : 1;
  let axeViolationClassNames = isPresent(configuredAxeViolationClassNames) ? configuredAxeViolationClassNames : [];
  let turnAuditOff = configuredTurnAuditOff || false;

  // Avoid modifying the Component class if the visual audit feature is configured disabled
  // and axe-core is excluded from the dev build
  if ((turnAuditOff && excludeAxeCore) || typeof axe === 'undefined') {
    hasRan = true;
    return;
  }

  Component.reopen({
    /**
     * An optional callback to process the results from the a11yCheck.
     * Defaults to `undefined` if not set in the application's configuration.
     *
     * @public
     * @type {Function}
     */
    axeCallback,

    /**
     * An optional options object to be used in a11yCheck.
     * Defaults to empty object if not set in the application's configuration.
     * @public
     * @type {Object}
     */
    axeOptions,

    /**
     * Turns off the accessibility audit during rendering.
     *
     * @public
     * @default false
     * @type {Boolean}
     */
    turnAuditOff,

    /**
     * An array of classNames (or a space-separated string) to add to the component when a violation occurs.
     * If unspecified, `ember-a11y-testing` will use a default class according to
     * the current `visualNoiseLevel`
     *
     * @public
     * @type {(Array|string)}
     * @see(https://github.com/ember-a11y/ember-a11y-testing/blob/master/content-for/head-footer.html)
     */
    axeViolationClassNames,

    /**
     * A numeric setting to determine the class applied to elements with violations
     *
     * @public
     * @type {string}
     * @see(https://github.com/ember-a11y/ember-a11y-testing/blob/master/content-for/head-footer.html)
     */
    visualNoiseLevel,

    /**
     * Computes class name to be set on the element according to the
     * current `visualNoiseLevel` and the value of `axeViolationClassNames`
     * (giving precedence to the latter).
     *
     * @private
     * @return {string}
     */
    violationClasses: computed('axeViolationClassNames', 'visualNoiseLevel', {
      get() {
        const customViolationClass = this.get('axeViolationClassNames');
        const visualNoiseLevel = this.get('visualNoiseLevel');

        if (visualNoiseLevel < 1) {
          return null;
        }
        if (isEmpty(customViolationClass)) {
          return [VIOLATION_CLASS_MAP[`LEVEL_${visualNoiseLevel}`]];
        }

        return isArray(customViolationClass) ? customViolationClass : customViolationClass.trim().split(/\s+/);
      }
    }),

    didRender() {
      this._super(...arguments);
      this._runAudit();
    },

    /**
     * Runs the axe a11yCheck audit and logs any violations to the console. It
     * then passes the results to axeCallback if one is defined. Finally, it logs
     * the violationsHelper tip once after all of the components are rendered.
     * @public
     * @return {Void}
     */
    audit() {
      if (this.get('tagName') !== '') {
        concurrentAxe.run(this.element, this.axeOptions, (error, results) => {
          if (this.get('isDestroyed')) {
            return;
          }

          if (error) {
            throw error;
          }

          const violations = results.violations;
          const violationClasses = this.get('violationClasses') || [];
          const visualNoiseLevel = this.get('visualNoiseLevel');

          let violation;
          let nodes;
          let nodeData;
          let nodeElem;
          let classNamesToAdd;
          for (let i = 0, l = violations.length; i < l; i++) {
            violation = violations[i];

            nodes = violation.nodes;

            if (isEmpty(nodes) || nodes.length === 0) {
              console.error(formatViolation(violation), violation); // eslint-disable-line no-console
              violationsHelper.push(violation);
            }

            for (let j = 0, k = nodes.length; j < k; j++) {
              nodeData = nodes[j];

              console.error(formatViolation(violation, nodeData.html), violation); // eslint-disable-line no-console
              violationsHelper.push(violation);

              if (nodeData) {
                nodeElem = document.querySelector(nodeData.target.join(','));
                classNamesToAdd = isBackgroundReplacedElement(nodeElem) ? [VIOLATION_CLASS_MAP.REPLACED_ELEMENT] : violationClasses;

                nodeElem.classList.remove(...VIOLATION_CLASS_NAMES);

                if (visualNoiseLevel > 0) {
                  nodeElem.classList.add(...classNamesToAdd);
                }
              }
            }
          }

          if (this.axeCallback) {
            assert('axeCallback should be a function.', typeof this.axeCallback === 'function');
            this.axeCallback(results);
          }

          scheduleOnce('afterRender', violationsHelper, violationsHelper.logTip);
        });
      }
    },

    /**
     * Runs an accessibility audit on any render of the component.
     * @private
     * @return {Void}
     */
    _runAudit() {
      if (this.turnAuditOff || Ember.testing) { return; }

      scheduleOnce('afterRender', this, 'audit');
    }
  });

  hasRan = true;
}

export default {
  name: 'axe-component',
  after: 'violations-helper',
  initialize
};
