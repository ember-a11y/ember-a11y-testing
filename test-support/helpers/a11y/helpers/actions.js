/**
 * Helpers related to ensuring all actions are able to be used by all users
 * Reference: http://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-keyboard-operable.html
 */

import A11yError from '../a11y-error';

// Selectors for all focusable elements
const FOCUSABLE_SELECTOR = [
  'input:not([type=hidden]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'a[href]',
  'area[href]',
  'iframe',
  '[tabindex]'
].join(',');

// Selector to find any Ember-bound actions
const ACTION_SELECTOR = '[data-ember-action]';

/**
 * Determines if a given action element is focusable
 * @param {Object} app - Not used
 * @param {HTMLElement} - The element with an action to test
 * @return {Boolean|Error}
 */
export function actionIsFocusable(app, el) {
  if (el.matches(FOCUSABLE_SELECTOR)) {
    throw new A11yError(`The action on ${el} is inaccessible, since the element does not receive focus.`);
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
