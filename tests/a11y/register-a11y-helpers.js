import Ember from 'ember';

import { hasAltText, allImagesHaveAltText } from './helpers/alt-text';
import { hasLabel } from './helpers/form-labels';

export default function registerA11yHelpers() {
  Ember.Test.registerHelper('hasAltText', hasAltText);
  Ember.Test.registerHelper('allImagesHaveAltText', allImagesHaveAltText);
  Ember.Test.registerHelper('hasLabel', hasLabel);
}
