import Component from '@ember/component';

export function initialize(/* application */) {
  Component.reopen({
    attributeBindings: ['data-test-selector']
  });
}

export default {
  name: 'component-data-attributes',
  initialize
};
