import Component from '@ember/component';
import layout from '../templates/components/violations-grid-item';


export default Component.extend({
  layout,
  tagName: 'li',
  classNames: ['c-violations-grid-item', 'o-content-box'],

  title: null
});
