/**
 * Helpers related to checking forms for labels/descriptive text
 * Reference: http://www.w3.org/TR/WCAG20/#minimize-error
 */

import A11yError from '../a11y-error';

// Define the types of input elements that require a label
const NEEDS_LABEL = ['text', 'checkbox', 'radio', 'file', 'password'];

/**
 * Checks to make sure an element has the appropriate descriptive text or label
 * @param {Object} app - Not used
 * @param {HTMLElement} el - The element to test
 * @return {Boolean|Error}
 */
export function hasLabel(app, el) {
  let tagName = el.tagName;

  if (tagName === 'INPUT') {
    if (NEEDS_LABEL.indexOf(el.type) !== -1) {
      // Input requires a label. First check that it has an id,
      var elementId = el.id;

      if (!elementId) {
        throw new A11yError(`${el} has no ID. Please add an ID to associate it with a labels for attribute.`);
      }

      // Then, find the label for the input
      var label = document.querySelector(`[for="${elementId}"]`);

      if (!label) {
        throw new A11yError(`${el} has no associated label. Please add a label and reference this element via the for attribute`);
      } else if (!label.innerHTML) {
        throw new A11yError(`the label for ${el} has no content. Please add content to make this label useful.`);
      }

      // Input needs label and has one with all needed information
      return true;
    } else {
      // Input does not require a label for it
      return true;
    }
  }

  // Label is not required to have a label
  return true;
}
