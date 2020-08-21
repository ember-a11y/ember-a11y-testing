import Component from '@ember/component';
import layout from '../templates/components/x-div';

/**
 * This component merely exists as a convenience for creating
 * components with violations that don't quite fit into any
 * other element tag category.
 */
export default Component.extend({
  layout,
  tagName: 'div',
});
