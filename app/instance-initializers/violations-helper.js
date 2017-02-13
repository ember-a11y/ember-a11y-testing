import ViolationsHelper from 'ember-a11y-testing/utils/violations-helper';

export function initialize() {
  window.violationsHelper = new ViolationsHelper();
}

export default {
  name: 'violations-helper',
  before: 'axe-component',
  initialize
};
