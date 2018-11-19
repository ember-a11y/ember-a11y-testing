/**
 * Exposes performance API if it exists in the current environment.
 *
 * @constant
 * @private
 * @type {Booelan}
 */
const performance = hasPerformanceApi() ? window.performance : undefined;

/**
 * Utility to check performance API.
 *
 * @return {Boolean}
 * @private
 */
function hasPerformanceApi() {
  return window &&
    typeof window.performance !== 'undefined' &&
    typeof window.performance.mark === 'function' &&
    typeof window.performance.measure === 'function';
}

/**
 * Utility to add a performance marker.
 *
 * @param {String} name 
 * @public
 */
export function mark(name) {
  if (performance) {
    performance.mark(name);
  }
}

/**
 * Utility to measure performance between the start and end markers.
 *
 * @param {String} comment
 * @param {String} startMark
 * @param {String} endMark
 * @return {Void}
 * @public
 */
export function measure(comment, startMark, endMark) {
  // `performance.measure` may fail if the mark could not be found.
  // reasons a specific mark could not be found include outside code invoking `performance.clearMarks()`
  try {
    performance.measure(comment, startMark, endMark);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('performance.measure could not be executed because of ', e.message);
  }
}

/**
 * Utility to place end marker and measure performance.
 *
 * @param {String} comment
 * @param {String} startMark
 * @param {String} endMark
 * @return {Void}
 * @public
 */
export function markEndAndMeasure(comment, startMark, endMark) {
  if (performance) {
    mark(endMark);
    measure(comment, startMark, endMark);
  }
}

export default {
  /**
   * Utility to get window location object.
   *
   * @return {Object}
   * @public
   */
  getLocation() {
    return window && window.location;
  }
};
