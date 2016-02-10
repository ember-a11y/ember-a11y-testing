/**
 * Helpers related to verifying hidden content is not focusable.
 * Reference: https://www.w3.org/TR/WCAG20/#navigation-mechanisms-focus-order
 */

import A11yError from '../a11y-error';

/**
 * Determines the visibility of an element.
 * @param {HTMLElement} el - The element to test
 * @return {Boolean}
 */
function checkIsVisible(el) {
  return el && el.style.opacity !== 0 &&
         el.style.visibility !== 'none' &&
         el.style.display !== 'none' &&
         el.style.height !== 0 &&
         el.style.width !== 0 &&
         el.getAttribute('type') !== 'hidden' &&
         el.getAttribute('aria-hidden') !== 'true';
}

/**
 * Checks a specific element to ensure it is allowed focus
 * @param {Object} app - Not used
 * @param {HTMLElement} el - The element to check
 * @return {Boolean|Error}
 */
export function isAllowedFocus(app, el) {
  let isVisible = checkIsVisible(el);
  if (isVisible) {
    return true;
  }

  throw new A11yError(el, `The element is hidden, but still focusable. Remove the tabindex attribute to ensure focus won't occur.`);
}

/**
 * Checks all elements on the page to make sure they are allowed focus
 * @return {Boolean|Error}
 */
export function allAreAllowedFocus() {
  let focusable = document.querySelectorAll('[tabindex]');

  for (let i = 0, l = focusable.length; i < l; i++) {
    isAllowedFocus(null, focusable[i]);
  }

  return true;
}
