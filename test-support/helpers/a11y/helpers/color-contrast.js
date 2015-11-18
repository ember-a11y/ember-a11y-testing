/**
 * Helpers related to verifying color contrast between text and its background.
 * Reference: http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html
 *            http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast7.html
 */

import A11yError from '../a11y-error';
import { extractRGB, checkContrastThreshold } from '../utils/visual-information';

// The various levels of contrast testing conformance
const LEVEL = {
  AA: 'AA',
  AAA: 'AAA'
};

// The various contrast ratios needed for conformance
const RATIOS = {
  NORMAL: 4.5,
  LARGE: 3,
  ENHANCED_NORMAL: 7,
  ENHANCED_LARGE: 4.5
};

/**
 * Tests if a DOM node has any textual content
 * @param {Node} node - The node to test
 * @return {Boolean}
 */
function nodeHasText(node) {
  return !!node.textContent.trim();
}

/**
 * Tests if an element has a background other than transparent
 * @param {HTMLElement} element - The element to test
 * @return {Boolean}
 */
function hasBackground(element) {
  let style = window.getComputedStyle(element);
  return style.backgroundImage !== 'none' || style.backgroundColor !== 'rgba(0, 0, 0, 0)';
}

/**
 * Adjusts the ember testing container to occupy the entire window, for a more
 * accurate representation of how the app looks when running
 * @return {Void}
 */
function adjustTestingContainer() {
  let testingContainer = document.getElementById('ember-testing-container');
  testingContainer.style.position = 'absolute';
  testingContainer.style.top = '0';
  testingContainer.style.left = '0';
  testingContainer.style.border = 'none';
  testingContainer.style.width = '100%';
  testingContainer.style.height = '100%';
}

/**
 * Resets the ember testing container after adjustTestingContainer has been used
 * @return {Void}
 */
function resetTestingContainer() {
  let testingContainer = document.getElementById('ember-testing-container');
  testingContainer.style.position = '';
  testingContainer.style.top = '';
  testingContainer.style.left = '';
  testingContainer.style.border = '';
  testingContainer.style.width = '';
  testingContainer.style.height = '';
}

/**
 * Grabs all text nodes on the page, finds their background element, and checks
 * their contrast ratio to ensure accessibility
 * @param {Object} app - Not used
 * @param {String} level - The level of conformance to check, defaults to 'AA'
 * @return {Boolean|Error}
 */
export function checkAllTextContrast(app, level) {
  // Set the conformance level we plan to check
  if (level !== LEVEL.AA && level !== LEVEL.AAA) {
    level = LEVEL.AA;
  }

  // Adjust the testing container to ensure correct results
  adjustTestingContainer();

  // Step 1: Grab all non-empty text nodes on the page
  let whatToShow = NodeFilter.SHOW_TEXT;
  let testingEl = document.getElementById('ember-testing');
  let treeWalker = document.createTreeWalker(testingEl, whatToShow, nodeHasText);

  let nodes = [];
  while (treeWalker.nextNode()) {
    nodes.push(treeWalker.currentNode);
  }

  // Step 2: Loop over all text nodes
  let testingContainer = document.getElementById('ember-testing-container');
  for (let i = 0, l = nodes.length; i < l; i++) {
    testingEl.style.zoom = '100%';

    let node = nodes[i];

    // Step 3: Get the text node's HTMLElement
    let text = node.parentElement;

    // Step 4: Find the element that acts as the background for this text
    let background = text;
    let hiddenEls = [];

    // Get the coordinates of the text
    let coords = text.getBoundingClientRect();

    // If the element is outside the view port, scroll it into view and
    // re-calculate the coordinates
    if (coords.top > testingContainer.clientHeight) {
      testingContainer.scrollTop = coords.top;
      coords = text.getBoundingClientRect();
    }

    // Traverse through the layers of the page until we find the background
    while (!hasBackground(background)) {
      background.style.pointerEvents = 'none';
      hiddenEls.push(background);
      background = document.elementFromPoint(coords.left, coords.top);
    }

    // Reset pointer events for any elements we disabled
    hiddenEls.forEach((el) => el.style.pointerEvents = '');

    // Check if the background is a background-image
    if (window.getComputedStyle(background).backgroundImage !== 'none') {
      console.warn(`${node} has a background-image for its background, be careful that the contrast ratio is still accessible`);
      continue;
    }

    // Step 5: Compare the contrast of the text and background
    checkTextContrast(null, text, background, level);

    // Reset everything
    testingContainer.scrollTop = 0;
    testingEl.style.zoom = '';
  }

  // Reset the testing container to avoid messing up subsequent tests
  resetTestingContainer();

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
  let testingContainer = document.getElementById('ember-testing');

  // We need to reset zoom to make sure font-sizes are caluclated appropriately
  testingContainer.style.zoom = '100%';

  let textStyle = window.getComputedStyle(text);
  let bgStyle = window.getComputedStyle(background);

  let foregroundRGB = extractRGB(textStyle.color);
  let backgroundRGB = extractRGB(bgStyle.backgroundColor);

  let ratio = getRatioToUse(textStyle, level);

  let result = checkContrastThreshold(foregroundRGB, backgroundRGB, ratio);

  // Undo our zoom changes from before
  testingContainer.style.zoom = null;

  if (!result) {
    throw new A11yError(`The contrast between "${text.text}" and ${background} is lower than expected for ${level} standards`);
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
