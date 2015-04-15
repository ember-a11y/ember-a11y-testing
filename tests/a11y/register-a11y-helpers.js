import Ember from 'ember';

import { hasAltText, allImagesHaveAltText } from './helpers/alt-text';
import { checkAriaHidden, checkForNoRead } from './helpers/no-read';
import { hasLabel, formHasAllNeededLabels, allFormsHaveLabels } from './helpers/form-labels';

/**
 * @TODO: add ability to customize which tests are ran
 * Performs every full-page test available
 * @retun {Boolean|Error}
 */
function a11yTest() {
  allImagesHaveAltText();
  checkForNoRead();
  allFormsHaveLabels();
  return true;
}

export default function registerA11yHelpers() {
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
}
