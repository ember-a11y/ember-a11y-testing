/**
 * Helpers related to checking forms for labels.
 * Reference: http://www.w3.org/TR/WCAG20/#minimize-error
 */

import A11yError from '../a11y-error';

const NEEDS_LABEL = ['text', 'checkbox', 'radio', 'file', 'password'];

/**
 * Checks to make sure the page has an explicit language defined.
 * @return {Boolean|Error}
 */
export function hasLabel(app, el) {
  let tagName = el.tagName;

  if (tagName === 'INPUT') {
    if (NEEDS_LABEL.indexOf(el.type) !== -1) {
      var elementId = el.id;

      if (!elementId) {
        throw new A11yError(`${el} has no ID. Please add an ID to associate it
          with a labels for attribute.`);
      }

      var label = document.querySelector(`[for="${elementId}"]`);

      if (!label) {
        throw new A11yError(`${el} has no associated label. Please add a label
          and reference this element via the for attribute`);
      }


    } else {
      return true;
    }
  }

  throw new A11yError(`${el} has no alt text. Either add an alt description or
    add the aria-hidden attribute.`);
}
