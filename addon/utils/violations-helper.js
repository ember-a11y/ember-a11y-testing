import Ember from 'ember';
/**
 * @module ember-a11y-testing
 *
 *
 * Use the violations helper to inspect the collection of violations.
 * This provides a set of handy helper methods so you can quickly query
 * and filter the violations from the console.
 *
 *
 * Helper methods include:
 * - count
 * - first
 * - last
 * - push
 * - filterBy
 *
 * @public
 * @class ViolationsHelper
 */
export default class ViolationsHelper {
  /**
   * Instantiate by calling either:
   *
   * new ViolationsHelper() or
   * new ViolationsHelper(violation1, violation2, ...)
   *
   */
  constructor() {
    this.violations = Array.prototype.slice.call(arguments);
    this.hasLoggedTip = false;
  }

  /**
   * Alias method to return the current number of violations
   *
   * @public
   * @type {Number}
   */
  get count() { return this.violations.length; }

  /**
   * Alias method to return the first violation
   *
   * @public
   * @type {Object}
   */
  get first() { return this.violations[0]; }

  /**
   * Alias method to return the last violation
   *
   * @public
   * @type {Object}
   */
  get last() { return this.violations[this.count - 1]; }

  /**
   * Alias method to push a violation into the collection
   *
   * @public
   * @return {Void}
   */
  push(violation) {
    this.violations.push(violation);
  }

  /**
   * Filters violations by a key value pair such as:
   * key = "impact", value = "critical"
   *
   * Special cases:
   * The "rule" key is an alias for the "id" key.
   * The "node" key filters violations by nodes with the selector of value.
   *
   * @public
   * @return {Array}
   */
  filterBy(key, value) {
    if (key === "rule") { key = "id"; }

    return this.violations.filter((violation) => {
      if (key === "node") {
        return violation.nodes[0].target[0] === value;
      }
      return violation[key] === value;
    });
  }

  /**
   * Logs the tips for using violationHelper in the console.
   * Only logs if there are existing violations and the tip has not been logged before.
   *
   * @type {Function}
   */
  logTip() {
    if (this.count && !this.hasLoggedTip) {
      Ember.Logger.info("You can inspect or filter your violations from the console with: window.violationsHelper");
      Ember.Logger.info("For a description of violationsHelper's API, see: https://github.com/ember-a11y/ember-a11y-testing/blob/master/addon/utils/violations-helper.js");
      this.hasLoggedTip = true;
    }
  }
}
