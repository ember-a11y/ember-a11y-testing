import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  attributeBindings: ['data-test-selector']
});
