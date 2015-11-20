/**
 * Helpers related to verifying proper ARIA properties are used on elements with
 * ARIA roles.
 * Reference: http://www.w3.org/TR/aria-in-html/#aria-role-state-and-property-quick-reference
 *            http://www.w3.org/TR/wai-aria/appendices#quickref
 */

import A11yError from '../a11y-error';
import { ARIA_MAP, GLOBAL_ARIA } from '../utils/wai-aria-map';


/**
 * Checks for a specific ARIA property on an element and throws an error if it
 * is not set.
 * @param {HTMLElement} el - The element to check
 * @param {String} prop - The property to check, minus the 'aria-' prefix
 * @return {Boolean|Error}
 */
function checkAriaProp(el, prop) {
  if (el.getAttribute(`aria-${prop}`) === null) {
    throw new A11yError(el, `The element is required to have the attribute 'aria-${prop}' when using role='${el.getAttribute('role')}'.`);
  }

  return true;
}

/**
 * Checks for a specific ARIA property on an element and throws an error if it
 * is not set.
 * @param {HTMLElement} el - The element to check
 * @return {Object|Error}
 */
function getAriaRole(el) {
  let role = el.getAttribute('role');

  if (role && !ARIA_MAP[role]) {
    throw new A11yError(el, `The role '${role}' is not a valid role. You should remove it.`);
  }

  return role;
}

/**
 * Checks the role of an element and verifies that it has all of its required
 * ARIA properties (if any).
 * @param {Object} app - Not used
 * @param {HTMLElement} el - The element to check
 * @return {Boolean|Error}
 */
export function verifyRequiredAria(app, el) {
  let role = getAriaRole(el);

  if (!role) {
    return true;
  }

  let roleMap = ARIA_MAP[role];
  let requiredProps = roleMap && roleMap.required;

  if (requiredProps) {
    requiredProps.forEach(function(prop) {
      checkAriaProp(el, prop);
    });
  }

  return true;
}

/**
 * Checks the role of an element and verifies that all of the ARIA attributes
 * applied to it are supported
 * @param {Object} app - Not used
 * @param {HTMLElement} el - The element to check
 * @return {Boolean|Error}
 */
export function verifySupportedAria(app, el) {
  let role = getAriaRole(el);

  if (!role) {
    return true;
  }

  let ariaAttributes = Array.prototype.filter.call(el.attributes, (attribute) => attribute.name.indexOf('aria-') === 0);
  ariaAttributes = ariaAttributes.map((attr) => attr.name.substr(5));

  let roleMap = ARIA_MAP[role];

  if (roleMap) {
    let roleSpecificProperties = [];

    if (roleMap.required) {
      roleSpecificProperties.push(roleMap.required);
    }

    if (roleMap.supported) {
      roleSpecificProperties.push(roleMap.supported);
    }

    let supportedAttributes = GLOBAL_ARIA.concat(...roleSpecificProperties);

    ariaAttributes.forEach((item) => {
      if (supportedAttributes.indexOf(item) === -1) {
        throw new A11yError(el, `The attribute 'aria-${item}' is not a supported ARIA property/state for '${role}'; you should remove it`);
      }
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
    let element = elementsWithRoles[i];
    verifyRequiredAria(null, element);
    verifySupportedAria(null, element);
  }

  return true;
}
