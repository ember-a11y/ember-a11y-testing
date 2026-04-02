const HAS_PERFORMANCE = window && typeof window.performance !== 'undefined' && typeof window.performance.mark === 'function' && typeof window.performance.measure === 'function';

/**
 * Utility to add a performance marker.
 *
 * @param markName
 */
function mark(markName) {
  if (HAS_PERFORMANCE) {
    performance.mark(markName);
  }
}

/**
 * Utility to measure performance between the start and end markers.
 *
 * @param comment
 * @param startMark
 * @param endMark
 */
function measure(comment, startMark, endMark) {
  // `performance.measure` may fail if the mark could not be found.
  // reasons a specific mark could not be found include outside code invoking `performance.clearMarks()`
  try {
    if (HAS_PERFORMANCE) {
      performance.measure(comment, startMark, endMark);
    }
  } catch (e) {
    console.warn('performance.measure could not be executed because of ',
    // @ts-expect-error: this is fine
    e.message);
  }
}

/**
 * Utility to place end marker and measure performance.
 *
 * @param comment
 * @param startMark
 * @param endMark
 */
function markEndAndMeasure(comment, startMark, endMark) {
  if (HAS_PERFORMANCE) {
    mark(endMark);
    measure(comment, startMark, endMark);
  }
}

export { mark, markEndAndMeasure, measure };
//# sourceMappingURL=performance.js.map
