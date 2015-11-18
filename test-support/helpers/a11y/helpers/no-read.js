/**
 * Helpers related to checking elements that shouldn't be read by screen-readers
 * yet are still visible on screen.
 * Reference: http://www.w3.org/TR/wai-aria/states_and_properties#aria-hidden
 */

import A11yError from '../a11y-error';

// Define the types of html elements that we'll check for content/aria-hidden
const CHECK_FOR_HIDDEN = ['p','h1','h2','h3','h4','h5','h6','i','b','span','a'];

/**
 * Determines the visibility of an element.
 * @param {HTMLElement} el - The element to test
 * @return {Boolean}
 */
function checkIsVisible(el) {
  return el.style.opacity !== 0 &&
         el.style.visibility !== 'none' &&
         el.style.display !== 'none';
}

/**
 * Checks an element to see if it has actual content, if not and it is still
 * visible, it should have aria-hidden=true. Use this primarily with elements
 * that should contain text.
 * @param {Object} app - Not used
 * @param {HTMLElement} el - The element to test
 * @return {Boolean|Error}
 */
export function checkAriaHidden(app, el, throwError) {
  let isVisible = checkIsVisible(el);
  let hasContent = el.innerHTML;

  if (!hasContent && isVisible) {
    // Should have aria-hidden=true
    let ariaHidden = el.getAttribute('aria-hidden');
    if (ariaHidden !== 'true') {
      let message = `The element has no content yet is visible, it should probably have aria-hidden="true" set.`;
      if (throwError) {
        throw new A11yError(el, message);
      } else {
        console.warn(el, message);
      }
    }
  }

  // All good!
  return true;
}

/**
 * Checks for all elements that should have aria-hidden=true if they don't have
 * content and are visible.
 * @return {Boolean|Error}
 */
export function checkForNoRead(app, throwErrors) {
  throwErrors = throwErrors === 'throwErrors';

  let testingContainer = document.getElementById('ember-testing');
  let elements = testingContainer.querySelectorAll(CHECK_FOR_HIDDEN.join(','));

  for (let i=0, l=elements.length; i<l; i++) {
    checkAriaHidden(null, elements[i], throwErrors);
  }

  return true;
}
