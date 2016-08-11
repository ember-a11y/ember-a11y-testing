import Ember from 'ember';
import layout from '../templates/components/x-paragraph';

export default Ember.Component.extend({
  layout,
  tagName: 'p',
  classNames: ['c-paragraph']
});
