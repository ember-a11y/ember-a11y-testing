import A11yError from '../a11y-error';

export function hasAltText(app, el) {
  var altText = el && el.getAttribute('alt');

  if (!altText) {
    throw new A11yError(`${el} has no alt text`);
  }

  return true;
}

export function allImagesHaveAltText() {
  var images = document.querySelectorAll('img');

  for (var i=0, l=images.length; i<l; i++) {
    hasAltText(null, images[i]);
  }

  return true;
}
