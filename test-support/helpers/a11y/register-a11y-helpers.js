import Ember from 'ember';

import { hasAltText, allImagesHaveAltText } from './helpers/alt-text';
import { checkAriaHidden, checkForNoRead } from './helpers/no-read';
import { hasLabel, formHasAllNeededLabels, allFormsHaveLabels } from './helpers/form-labels';
import { verifyRequiredAria, verifySupportedAria, checkAriaRoles } from './helpers/aria-properties';
import { checkIds } from './helpers/id-checks';
import { checkLinkForMerge, checkLinkHref, checkLinkText, checkLinks } from './helpers/links';
import { checkTextContrast } from './helpers/color-contrast';

const TEST_FUNCTIONS = [
  allImagesHaveAltText,
  checkForNoRead,
  checkAriaRoles,
  allFormsHaveLabels,
  checkIds,
  checkLinks
];

const DEFAULT_CONFIG = {
  allImagesHaveAltText: true,
  checkForNoRead: true,
  checkAriaRoles: true,
  allFormsHaveLabels: true,
  checkIds: true,
  checkLinks: true
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
      testFn(null, testVal);
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
}
