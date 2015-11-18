/**
 * Helpers related to ensuring all actions are able to be used by all users
 * Reference: http://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-keyboard-operable.html
 */

import A11yError from '../a11y-error';

// Selectors for all focusable elements
const FOCUS_SELECTORS = [
  'input:not([type=hidden]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'a[href]',
  'area[href]',
  'iframe',
  '[tabindex]:not([tabindex="-1"])'
];

// Selector to find any Ember-bound actions
const ACTION_SELECTOR = '[data-ember-action]';

// Add polyfill for browsers that don't have Element.matches (including Phantom)
if (!Element.prototype.matches) {
  Element.prototype.matches = function(selector) {
    let el = this;
    let matches = (el.document || el.ownerDocument).querySelectorAll(selector);
    let i = 0;

    while (matches[i] && matches[i] !== el) {
      i++;
    }

    return matches[i] ? true : false;
  };
}


/**
 * Determines if a given action element is focusable
 * @param {Object} app - Not used
 * @param {HTMLElement} - The element with an action to test
 * @return {Boolean|Error}
 */
export function actionIsFocusable(app, el) {
  if (!FOCUS_SELECTORS.filter((selector) => el.matches(selector)).length) {
    throw new A11yError(`The action on "${el.text}" is inaccessible, since the element does not receive focus.`);
  }

  return true;
}

/**
 * Checks all elements with actions on the page to ensure they are focusable
 * @return {Boolean|Error}
 */
export function allActionsFocusable() {
  let actions = document.querySelectorAll(ACTION_SELECTOR);

  for (let i = 0, l = actions.length; i < l; i++) {
    actionIsFocusable(null, actions[i]);
  }

  return true;
}
