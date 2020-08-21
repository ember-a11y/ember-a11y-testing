import violationsHelper from 'ember-a11y-testing/utils/violations-helper';

export function initialize() {
  window.violationsHelper = violationsHelper;
}

export default {
  name: 'violations-helper',
  before: 'axe-component',
  initialize,
};
