/**
 * Variable to ensure that the initializer is only ran once. Though in this
 * particular case, running more than once shouldn't cause side-effects.
 * @type {Boolean}
 */
let hasRan = false;

export function initialize(application) {
  if (hasRan) { return; }

  Ember.Component.reopen({
    /**
     * An optional callback to process the results from the a11yCheck.
     * @public
     * @type {Function}
     */
    axeCallback: undefined,

    /**
     * An optional options object to be used in a11yCheck.
     * @public
     * @type {Object}
     */
    axeOptions: undefined,

    /**
     * Turns off the accessibility audit during rendering.
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
      axe.a11yCheck(this.$(), this.axeOptions, (results) => {
        let violations = results.violations;

        for (let i = 0, l = violations.length; i < l; i++) {
          let violation = violations[i];

          Ember.Logger.error(`Violation #${i+1}`, violation);

          let nodes = violation.nodes;

          for (let j = 0, k = nodes.length; j < k; j++) {
            let node = nodes[i];

            this.$(node.target.join(','))[0].classList.add('axe-violation');
          }
        }

        if (this.axeCallback && typeof this.axeCallback === 'function') {
          this.axeCallback(results);
        }
      });
    }
  });

  hasRan = true;
}

export default {
  name: 'axe-component',
  initialize: initialize
};
