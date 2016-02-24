import Ember from 'ember';

import { hasAltText, allImagesHaveAltText, allNonTextElementsHaveAltText } from './helpers/alt-text';
import { isAllowedFocus, allAreAllowedFocus } from './helpers/focusable-visibility';
import { checkAriaHidden, checkForNoRead } from './helpers/no-read';
import { hasLabel, formHasAllNeededLabels, allFormsHaveLabels } from './helpers/form-labels';
import { verifyRequiredAria, verifySupportedAria, checkAriaRoles } from './helpers/aria-properties';
import { checkIds } from './helpers/id-checks';
import { checkLinkForMerge, checkLinkHref, checkLinkText, checkLinks } from './helpers/links';
import { checkTextContrast, checkAllTextContrast } from './helpers/color-contrast';
import { actionIsFocusable, allActionsFocusable } from './helpers/actions';

const TEST_FUNCTIONS = [
  allImagesHaveAltText,
  allNonTextElementsHaveAltText,
  checkForNoRead,
  checkAriaRoles,
  allFormsHaveLabels,
  checkIds,
  checkLinks,
  checkAllTextContrast,
  allActionsFocusable,
  isAllowedFocus,
  allAreAllowedFocus
];

const DEFAULT_CONFIG = {
  allImagesHaveAltText: false,
  allNonTextElementsHaveAltText: true,
  checkForNoRead: true,
  checkAriaRoles: true,
  allFormsHaveLabels: true,
  checkIds: true,
  checkLinks: true,
  checkAllTextContrast: false,
  allActionsFocusable: true,
  allAreAllowedFocus: true
};

/**
 * Performs every full-page test available
 * @param {Object} app - Not used
 * @param {Object} config - Configures which tests run and how
 * @retun {Boolean|Error}
 */
function a11yTest(app, config) {
  config = Ember.$.extend({}, DEFAULT_CONFIG, config);

  TEST_FUNCTIONS.forEach(function(testFn) {
    let testVal = config[testFn.name];
    if (testVal) {
      try {
        testFn(null, testVal);
      } catch(error) {
        if (error.element) {
          console.error(error.element, error.message);
        }

        throw error;
      }
    }
  });

  return true;
}

export default function registerA11yHelpers() {
  // a11yTest suite
  Ember.Test.registerHelper('a11yTest', a11yTest);

  // alt-text
  Ember.Test.registerHelper('hasAltText', hasAltText);
  Ember.Test.registerHelper('allImagesHaveAltText', allImagesHaveAltText);
  Ember.Test.registerHelper('allNonTextElementsHaveAltText', allNonTextElementsHaveAltText);

  // no-read
  Ember.Test.registerHelper('checkAriaHidden', checkAriaHidden);
  Ember.Test.registerHelper('checkForNoRead', checkForNoRead);

  // form-labels
  Ember.Test.registerHelper('hasLabel', hasLabel);
  Ember.Test.registerHelper('formHasAllNeededLabels', formHasAllNeededLabels);
  Ember.Test.registerHelper('allFormsHaveLabels', allFormsHaveLabels);

  // aria-properties
  Ember.Test.registerHelper('verifyRequiredAria', verifyRequiredAria);
  Ember.Test.registerHelper('verifySupportedAria', verifySupportedAria);
  Ember.Test.registerHelper('checkAriaRoles', checkAriaRoles);

  // id-checks
  Ember.Test.registerHelper('checkIds', checkIds);

  // links
  Ember.Test.registerHelper('checkLinkForMerge', checkLinkForMerge);
  Ember.Test.registerHelper('checkLinkHref', checkLinkHref);
  Ember.Test.registerHelper('checkLinkText', checkLinkText);
  Ember.Test.registerHelper('checkLinks', checkLinks);

  // color-contrast
  Ember.Test.registerHelper('checkTextContrast', checkTextContrast);
  Ember.Test.registerHelper('checkAllTextContrast', checkAllTextContrast);

  // actions
  Ember.Test.registerHelper('actionIsFocusable', actionIsFocusable);
  Ember.Test.registerHelper('allActionsFocusable', allActionsFocusable);

  // focusable visibility
  Ember.Test.registerHelper('isAllowedFocus', isAllowedFocus);
  Ember.Test.registerHelper('allAreAllowedFocus', allAreAllowedFocus);
}
