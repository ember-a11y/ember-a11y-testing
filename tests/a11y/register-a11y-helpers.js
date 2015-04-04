import Ember from 'ember';

import { hasAltText, allImagesHaveAltText } from './helpers/alt-text';

export default function registerA11yHelpers() {
  Ember.Test.registerHelper('hasAltText', hasAltText);
  Ember.Test.registerHelper('allImagesHaveAltText', allImagesHaveAltText);
}
