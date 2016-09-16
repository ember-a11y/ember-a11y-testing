import Ember from 'ember';
import layout from '../templates/components/page-title';

/**
 * A simple page title component that we can use during testing to
 * perform opertations on a VIOLATIONLESS element
 */
export default Ember.Component.extend({
  layout,
  tagName: 'h2',
  title: null,

  click(ev) {
    ev.preventDefault();

    if (Ember.testing) {
      this.set('title', 'Clicked during tests');
    }
  }
});
