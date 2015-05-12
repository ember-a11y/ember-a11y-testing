/**
 * Helpers related to checking elements that shouldn't be read by screen-readers
 * yet are still visible on screen.
 * Reference: http://www.w3.org/TR/wai-aria/states_and_properties#aria-hidden
 */

import A11yError from '../a11y-error';

export function checkDuplicateLinks() {
  let testingContainer = document.getElementById('ember-testing');
  let links = testingContainer.querySelectorAll('a');

  for (let i = 0, l = links.length; i < l; i++) {
    let link = links[i];

    if (link.nextElementSibling && link.nextElementSibling.href === link.href) {
      throw new A11yError(`${link} and ${link.nextElementSibling} should be merged together.`);
    }
  }

  return true;
}
