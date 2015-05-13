/**
 * Helpers related to verifying proper ARIA properties are used on elements with
 * ARIA roles.
 * Reference: http://www.w3.org/TR/aria-in-html/#aria-role-state-and-property-quick-reference
 *            http://www.w3.org/TR/wai-aria/appendices#quickref
 */

import A11yError from '../a11y-error';
import ARIA_MAP from './wai-aria-map';

/**
 * Checks for a specific ARIA property on an element and throws an error if it
 * is not set.
 * @param {HTMLElement} el - The element to check
 * @param {String} prop - The property to check, minus the 'aria-' prefix
 * @return {Boolean|Error}
 */
function checkAriaProp(el, prop) {
  if (el.getAttribute(`aria-${prop}`) === null) {
    throw new A11yError(`${el} is required to have the attribute 'aria-${prop}' when using role='${el.getAttribute('role')}'.`);
  }

  return true;
}

/**
 * Checks the role of an element and verifies that it has all of its required
 * ARIA properties (if any).
 * @param {Object} app - Not used
 * @param {HTMLElement} - The element to check
 * @return {Boolean|Error}
 */
export function verifyRequiredAria(app, el) {
  let role = el.getAttribute('role');
  let roleMap = role && ARIA_MAP[role];
  let requiredProps = roleMap && roleMap.required;

  if (requiredProps) {
    requiredProps.forEach(function(prop) {
      checkAriaProp(el, prop);
    });
  }

  return true;
}

/**
 * Checks all elements with an ARIA role on the page.
 * @return {Boolean|Error}
 */
export function checkAriaRoles() {
  let elementsWithRoles = document.querySelectorAll('[role]');

  for (let i = 0, l = elementsWithRoles.length; i < l; i++) {
    verifyRequiredAria(null, elementsWithRoles[i]);
  }

  return true;
}
