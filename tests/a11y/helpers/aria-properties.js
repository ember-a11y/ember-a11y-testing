/**
 * Helpers related to verifying proper ARIA properties are used on elements with
 * ARIA roles.
 * Reference: http://www.w3.org/TR/WCAG20/#text-equiv
 */

import A11yError from '../a11y-error';

export function checkAriaProperties() {
  let testingContainer = document.getElementById('ember-testing');
  let roleElements = testingContainer.querySelectorAll('[role=*]');

  for (let i=0, l=roleElements.length; i<l; i++) {
    
  }
}
