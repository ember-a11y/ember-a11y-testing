/**
 * Helpers related to checking forms for labels/descriptive text
 * Reference: http://www.w3.org/TR/WCAG20/#minimize-error
 */

import A11yError from '../a11y-error';

// Define the types of input elements that require a label
const NEEDS_LABEL = ['text', 'checkbox', 'radio', 'file', 'password'];

/**
 * Given a tag, determine if it would need a label/alternative text element
 * @param {String} tag - The tag to test
 * @return {Boolean}
 */
function needsLabel(tag, type) {
  return (tag === 'INPUT' && NEEDS_LABEL.indexOf(type) !== -1) ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT';
}

/**
 * Verify that an element has a label
 * @param {HTMLElement} el - The element to verify has a label
 * @return {Boolean|Error}
 */
function verifyLabel(el) {
  let ariaBy = el.getAttribute('aria-describedby') ||
               el.getAttribute('aria-labelledby');

  if (ariaBy) {
    return verifyAriaLabel(el, ariaBy);
  } else {
    return verifyNonAriaLabel(el);
  }
}

/**
 * Verify that an element has a label via the describedby or labelledby ARIA
 * properties.
 * @param {HTMLElement} el - The element to verify
 * @param {String} ariaBy - The value of the aria property
 * @return {Boolean|Error}
 */
function verifyAriaLabel(el, ariaBy) {
  let ids = ariaBy.split(' ');

  for (let i = 0, l = ids.length; i < l; i++) {
    let label = document.getElementById(ids[i])
    if (!label) {
      throw new A11yError(el, `The element is missing the element it is associated with ID ${ids[i]}`);
    } else if (!label.innerHTML) {
      throw new A11yError(el, `The label with ID ${ids[i]} has no content. You should add content to make this label useful.`);
    }
  }

  return true;
}

/**
 * Verify that an element has a label via it's ID.
 * @param {HTMLElement} el - The element to verify
 * @return {Boolean|Error}
 */
function verifyNonAriaLabel(el) {
  let elementId = el.id;

  if (!elementId) {
    throw new A11yError(el, `The element has no ID, describedby, or labelledby attribute. You should add one to associate it with a label.`);
  }

  let label = document.querySelector(`[for="${elementId}"]`);

  if (!label) {
    throw new A11yError(el, `The element has an ID but no associated label. You should add a label and reference this element via the for attribute`);
  } else if (!label.innerHTML) {
    throw new A11yError(el, `The label for the element has no content. You should add content to make this label useful.`);
  }

  return true;
}

/**
 * Checks to make sure an element has the appropriate descriptive text or label
 * @param {Object} app - Not used
 * @param {HTMLElement} el - The element to test
 * @return {Boolean|Error}
 */
export function hasLabel(app, el) {
  let tagName = el.tagName;
  let type = el.type;

  if (needsLabel(tagName, type)) {
    return verifyLabel(el);
  } else if (tagName === 'INPUT' && (type === 'submit' || type === 'button')) {
    // Input is a submit button, there it should have a value set
    if (!el.value) {
      throw new A11yError(el, `The element has no value and is a ${type} input. You should add a value to the input so it has valuable meaning.`);
    }
  } else if (tagName === 'BUTTON') {
    // Element is a button, should have some inner content to describe it
    if (!el.innerHTML) {
      throw new A11yError(el, `The element has no inner content and is a button. You should add some content to give the button textual meaning.`);
    }
  }

  // All good!
  return true;
}

/**
 * Verifies all elements of a form that require labels have them
 * @param {Object} app - Not used
 * @param {HTMLElement} form - The form to test
 * @return {Boolean|Error}
 */
export function formHasAllNeededLabels(app, form) {
  let elements = form.querySelectorAll('input,button,textarea,select');

  for (let i=0, l=elements.length; i<l; i++) {
    hasLabel(app, elements[i]);
  }

  return true;
}

/**
 * Verifies all forms on the page have all the labels they need
 * @return {Boolean|Error}
 */
export function allFormsHaveLabels() {
  // Need to make sure we don't select the QUnit filtering form
  let forms = document.querySelectorAll('form:not(.qunit-filter)');

  for (let i=0, l=forms.length; i<l; i++) {
    formHasAllNeededLabels(null, forms[i]);
  }

  return true;
}
