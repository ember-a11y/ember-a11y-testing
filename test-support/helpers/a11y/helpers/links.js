/**
 * Helpers related to checking elements that shouldn't be read by screen-readers
 * yet are still visible on screen.
 * Reference: http://www.w3.org/TR/wai-aria/states_and_properties#aria-hidden
 */

import A11yError from '../a11y-error';

function loopOverLinks(callback) {
  let testingContainer = document.getElementById('ember-testing');
  let links = testingContainer.querySelectorAll('a');

  for (let i = 0, l = links.length; i < l; i++) {
    callback(links[i]);
  }

  return true;
}

function isBadHref(href) {
  return href === '' ||
         href.indexOf('#') === href.length-1 ||
         href.indexOf('javascript:') === 0 ||
         href.indexOf('<!--') === 0;
}

export function checkDuplicateLinks() {
  return loopOverLinks((link) => {
    if (link.nextElementSibling && link.nextElementSibling.href === link.href) {
      throw new A11yError(`${link} and ${link.nextElementSibling} should be merged together.`);
    }
  });
}

export function checkMeaningfulLinks() {
  return loopOverLinks((link) => {
    if (isBadHref(link.href)) {
      throw new A11yError(`${link} has a non-meaningful href.`);
    }
  });
}

export function checkLinkText(app, el) {
  if (!el.textContent) {
    let image = el.querySelector('img');

    if (image) {
      if (!image.alt) {
        throw new A11yError();
      }

      return true;
    }

    throw new A11yError(`${el} has no textual content.`);
  }

  return true;
}
