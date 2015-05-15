/**
 * Reference: http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html
 *            http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast7.html
 * Normal Text ratio of 4.5:1
 * Large Scale Text ratio of 3:1

 *
 * Text or images of text that are part of an inactive user interface component,
 * that are pure decoration, that are not visible to anyone, or that are part of
 * a picture that contains significant other visual content, have no contrast
 * requirement.
 *
 * Text that is part of a logo or brand name has no minimum contrast requirement.
 */

import A11yError from '../a11y-error';
import { extractRGB, checkContrastThreshold } from '../utils/visual-information';

const RATIOS = {
  NORMAL: 4.5,
  LARGE: 3,
  ENHANCED_NORMAL: 7,
  ENHANCED_LARGE: 4.5
};

/**
 * Checks the contrast between a text element and it's background element to
 * ensure it meets WCAG standards.
 * @param {Object} app - Not used
 * @param {HTMLElement} text
 * @param {HTMLElement} background (optional)
 * @return {Number} 
 */
export function checkTextContrast(app, text, background=text, level='AA') {
  // We need to reset zoom to make sure font-sizes are caluclated appropriately
  document.getElementById('ember-testing').style.zoom = '100%';

  let textStyle = window.getComputedStyle(text);
  let bgStyle = window.getComputedStyle(background);

  let foregroundRGB = extractRGB(textStyle.color);
  let backgroundRGB = extractRGB(bgStyle.backgroundColor);

  let ratio = getRatioToUse(textStyle, level);

  let result = checkContrastThreshold(foregroundRGB, backgroundRGB, ratio);

  // Undo our zoom changes from before
  document.getElementById('ember-testing').style.zoom = null;

  if (!result) {
    throw new A11yError(`The contrast between ${text} and ${background} is lower than expected for ${level} standards`);
  }

  return result;
}

/**
 * Determines if an element can be considered "large scale text", which is
 * defined as having a font-size of 18px or a font-size of 14px with bold weight
 * @param {CSSStyleDeclaration} style
 * @return {Boolean}
 */
function isLargeScaleText(style) {
  let fontSize = parseInt(style.fontSize, 10);

  if (fontSize >= 18) {
    return true;
  } else if (fontSize >= 14) {
    let fontWeight = style.fontWeight;
    let fontWeightNumber = parseInt(fontWeight, 10);

    if (isNaN(fontWeightNumber)) {
      return fontWeight.indexOf('bold') !== -1;
    } else {
      return fontWeightNumber > 400;
    }
  }

  return false;
}

/**
 * Gets the ratio to check the contrast values against as per the WCAG spec
 * @param {CSSStyleDeclaration} style
 * @param {String} level
 * @return {Number}
 */
function getRatioToUse(style, level) {
  let isLarge = isLargeScaleText(style);

  if (isLarge) {
    return level === 'AA' ? RATIOS.LARGE : RATIOS.ENHANCED_LARGE;
  } else {
    return level === 'AA' ? RATIOS.NORMAL : RATIOS.ENHANCED_NORMAL;
  }
}
