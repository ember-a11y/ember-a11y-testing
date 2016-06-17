import ENV from '../config/environment';

/**
 * Variable to ensure that the initializer is only ran once. Though in this
 * particular case, running more than once shouldn't cause side-effects.
 * @type {Boolean}
 */
let hasRan = false;

export function initialize(application) {
  if (hasRan) { return; }

  const addonConfig = ENV['ember-a11y-testing'] || {};
  const { componentOptions: { axeOptions, axeCallback } = {} } = addonConfig;

  Ember.Component.reopen({
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
     * Defaults to `undefined` if not set in the application's configuration.
     * @public
     * @type {Object}
     */
    axeOptions,

    /**
     * Turns off the accessibility audit during rendering.
     *
     * @public
     * @type {Boolean}
     */
    turnAuditOff: false,

    /**
     * Runs an accessibility audit on any render of the component.
     * @private
     * @return {Void}
     */
    _runAudit: Ember.on('didRender', function() {
      if (this.turnAuditOff || Ember.testing) { return; }

      this.audit();
    }),

    /**
     * Runs the axe a11yCheck audit and logs any violations to the console. It
     * then passes the results to axeCallback if one is defined.
     * @public
     * @return {Void}
     */
    audit() {
      if (this.get('tagName') !== '') {
        axe.a11yCheck(`#${this.elementId}`, this.axeOptions, (results) => {
          let violations = results.violations;

          for (let i = 0, l = violations.length; i < l; i++) {
            let violation = violations[i];

            Ember.Logger.error(`Violation #${i+1}`, violation);

            let nodes = violation.nodes;

            for (let j = 0, k = nodes.length; j < k; j++) {
              let node = nodes[j];

              if (node) {
                Ember.$(node.target.join(','))[0].classList.add('axe-violation');
              }
            }
          }

          if (this.axeCallback) {
            Ember.assert('axeCallback should be a function.', typeof this.axeCallback === 'function');
            this.axeCallback(results);
          }
        });
      }
    }
  });

  hasRan = true;
}

export default {
  name: 'axe-component',
  initialize
};
