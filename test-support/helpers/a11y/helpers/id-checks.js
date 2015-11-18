/**
 * Helpers related to verifying IDs on a page (this may not necessarily be a11y,
 * but IDs are often important for a11y attributes).
 * Reference: http://www.w3.org/TR/html5/dom.html#the-id-attribute
 */

import A11yError from '../a11y-error';

/**
 * Determines if a sorted array has any duplicate values; if so, returns the
 * value of the first duplicate entry
 * @param {Array} arr - A sorted array to check
 * @return {Object} - The value of the first duplicate, otherwise, undefined
 */
function hasDuplicates(arr) {
  let l = arr.length;

  if (l > 1) {
    for (let i = 1; i < l; i++) {
      if (arr[i-1] === arr[i]) {
        return arr[i];
      }
    }
  }
}

/**
 * Checks elements to ensure they only have a max of one ID
 * @param {Array} els - The elements to check
 * @return {Boolean|Error}
 */
function checkMultipleIds(els) {
  let multiIds = els.filter((el) => el.id.trim().split(/\s+/).length > 1);

  if (multiIds.length) {
    throw new A11yError(els, `${multiIds[0]} has multiple IDs; you should remove all but one of those.`);
  }

  return true
}

/**
 * Checks elements to ensure their ID is unique within the given set
 * @param {Array} els - The elements to check
 * @return {Boolean|Error}
 */
function checkIdDuplicates(els) {
  let ids = els.map((el) => el.id).sort();
  let duplicate = hasDuplicates(ids);

  if (duplicate) {
    throw new A11yError(duplicate, `The ID '${duplicate}' is used more than once; you should only use each ID once.`);
  }

  return true;
}

/**
 * Checks all elements on the page to ensure there aren't any multiple or
 * duplicate ids
 * @return {Boolean|Error}
 */
export function checkIds() {
  let elements = Array.prototype.slice.call(document.querySelectorAll('[id]'));
  return checkIdDuplicates(elements) && checkMultipleIds(elements);
}
