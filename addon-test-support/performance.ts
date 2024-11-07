const HAS_PERFORMANCE =
  window &&
  typeof window.performance !== 'undefined' &&
  typeof window.performance.mark === 'function' &&
  typeof window.performance.measure === 'function';

/**
 * Utility to add a performance marker.
 *
 * @param markName
 */
export function mark(markName: string) {
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
export function measure(comment: string, startMark: string, endMark: string) {
  // `performance.measure` may fail if the mark could not be found.
  // reasons a specific mark could not be found include outside code invoking `performance.clearMarks()`
  try {
    if (HAS_PERFORMANCE) {
      performance.measure(comment, startMark, endMark);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      'performance.measure could not be executed because of ',
      e.message,
    );
  }
}

/**
 * Utility to place end marker and measure performance.
 *
 * @param comment
 * @param startMark
 * @param endMark
 */
export function markEndAndMeasure(
  comment: string,
  startMark: string,
  endMark: string,
) {
  if (HAS_PERFORMANCE) {
    mark(endMark);
    measure(comment, startMark, endMark);
  }
}
