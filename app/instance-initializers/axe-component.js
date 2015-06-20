let hasRan = false;

export function initialize(application) {
  if (hasRan) {
    return;
  }

  Ember.Component.reopen({
    /**
     * An optional callback to process the results from the a11yCheck.
     * @type {Function}
     */
    axeCallback: undefined,

    /**
     * An optional options object to be used in a11yCheck.
     * @type {Object}
     */
    axeOptions: undefined,

    /**
     * Turns off the axe audit during rendering.
     * @type {Boolean}
     */
    turnAxeOff: false,

    /**
     * Runs an a11yCheck audit on any render of the component. It logs any
     * violations to the console and then passes the results to axeCallback.
     * @return {Void}
     */
    runAudit: Ember.on('didRender', function() {
      if (this.turnAxeOff || Ember.testing) {
        return;
      }

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
    })
  });

  hasRan = true;
}

export default {
  name: 'axe-component',
  initialize: initialize
};
