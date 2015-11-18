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

export function checkLinkForMerge(app, link) {
  if (link.nextElementSibling && link.nextElementSibling.href === link.href) {
    throw new A11yError(`"${link.text}" and "${link.nextElementSibling.text}" should be merged together since they are adjacent and point to the same link.`);
  }

  return true;
}

export function checkLinkHref(app, link) {
  if (isBadHref(link.href)) {
    throw new A11yError(`"${link.text}" has a non-meaningful href, it should point to an actual link.`);
  }

  return true;
}

export function checkLinkText(app, link) {
  if (!link.textContent) {
    let image = link.querySelector('img');

    if (image) {
      if (!image.alt) {
        throw new A11yError(`${image.src} in "${link.text}" should have alt text`);
      }

      return true;
    }

    throw new A11yError(`"${link.text}" has no textual content, you should add some to give the link meaning.`);
  }

  return true;
}

export function checkLinks() {
  return loopOverLinks((link) => {
    checkLinkForMerge(null, link);
    checkLinkHref(null, link);
    checkLinkText(null, link);
  });
}
