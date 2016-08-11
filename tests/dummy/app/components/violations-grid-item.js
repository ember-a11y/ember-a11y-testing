import Ember from 'ember';
import layout from '../templates/components/violations-grid-item';

const { Component } = Ember;


export default Component.extend({
  layout,
  tagName: 'li',
  classNames: ['c-violations-grid-item', 'o-content-box'],

  title: null
});
