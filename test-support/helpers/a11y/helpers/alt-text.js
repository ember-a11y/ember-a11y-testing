/**
 * Helpers related to verifying text alternatives to non-text based content.
 * Reference: http://www.w3.org/TR/WCAG20/#text-equiv
 */

import A11yError from '../a11y-error';

/**
 * Checks a specific element to make sure it has alt text
 * @param {Object} app - Not used
 * @param {HTMLElement} el - The element to check
 * @return {Boolean|Error}
 */
export function hasAltText(app, el) {
  let altText = el && el.getAttribute('alt');
  let ariaHidden = el && el.getAttribute('aria-hidden');
  let presentation = el && el.getAttribute('role') === 'presentation';

  if (altText || ariaHidden === 'true' || presentation) {
    return true;
  }

  throw new A11yError(`"${el.src || el.text}" has no alt text. Either add an alt description or add the aria-hidden attribute.`);
}

/**
 * Checks all <img> elements on the page to make sure they have alt text
 * @return {Boolean|Error}
 */
export function allImagesHaveAltText() {
  let images = document.querySelectorAll('img');

  for (let i = 0, l = images.length; i < l; i++) {
    hasAltText(null, images[i]);
  }

  return true;
}
