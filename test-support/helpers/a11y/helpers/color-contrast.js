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

const LEVEL = {
  AA: 'AA',
  AAA: 'AAA'
};

const RATIOS = {
  NORMAL: 4.5,
  LARGE: 3,
  ENHANCED_NORMAL: 7,
  ENHANCED_LARGE: 4.5
};

function filterEmpty(node) {
  return !!node.textContent.trim();
}

function hasBackground(element) {
  let style = window.getComputedStyle(element);
  return style.backgroundImage !== 'none' || style.backgroundColor !== 'rgba(0, 0, 0, 0)';
}

/**
 * Grabs all text nodes on the page, finds their background element, and checks
 * their contrast ratio to ensure accessibility
 * @return {Boolean|Error} 
 */
export function checkAllTextContrast(app, level) {
  // Set the conformance level we plan to check
  if (level !== LEVEL.AA && level !== LEVEL.AAA) {
    level = LEVEL.AA;
  }

  let testingContainer = document.getElementById('ember-testing-container');
  testingContainer.style.position = 'absolute';
  testingContainer.style.top = '0';
  testingContainer.style.left = '0';
  testingContainer.style.border = 'none';

  // Step 1: Grab all non-empty text nodes on the page
  let nodes = [];
  let whatToShow = NodeFilter.SHOW_TEXT;
  let el = document.getElementById('ember-testing');
  let treeWalker = document.createTreeWalker(el, whatToShow, filterEmpty);

  while (treeWalker.nextNode()) {
    nodes.push(treeWalker.currentNode);
  }

  // Step 2: Loop over all text nodes
  for (let i = 0, l = nodes.length; i < l; i++) {
    el.style.zoom = '100%';

    let node = nodes[i];

    // Step 3: Get the text node's HTMLElement
    let text = node.parentElement;

    // Step 4: Find the element that acts as the background for this text
    let background = text;
    let hiddenEls = [];

    // Get the coordinates of the text
    let coords = text.getBoundingClientRect();
    while (!hasBackground(background)) {
      background.style.pointerEvents = 'none';
      hiddenEls.push(background);
      background = document.elementFromPoint(coords.left, coords.top);
    }

    // Reset any elements
    hiddenEls.forEach((el) => el.style.pointerEvents = '');

    // Step 5: Compare the contrast of those two element
    checkTextContrast(null, text, background, level);
  
    el.style.zoom = '';
  }

  testingContainer.style.position = '';
  testingContainer.style.top = '';
  testingContainer.style.left = '';
  testingContainer.style.border = '';

  return true;
}

/**
 * Checks the contrast between a text element and it's background element to
 * ensure it meets WCAG standards.
 * @param {Object} app - Not used
 * @param {HTMLElement} text
 * @param {HTMLElement} background (optional)
 * @return {Boolean|Error} 
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
    return level === LEVEL.AA ? RATIOS.LARGE : RATIOS.ENHANCED_LARGE;
  } else {
    return level === LEVEL.AA ? RATIOS.NORMAL : RATIOS.ENHANCED_NORMAL;
  }
}
