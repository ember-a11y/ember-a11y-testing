import Component from '@ember/component';
import layout from '../templates/components/x-image';

export default Component.extend({
  layout,
  tagName: 'img',
  classNames: ['c-img'],
  attributeBindings: ['alt', 'src', 'srcset', 'sizes'],

  /**
   *💡💡 NOTE: Even an emtpy string has a separate and important meaning
   * compared to the attribute not existing altogether
   * @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-alt
   */
  alt: null,

  src: null,
  srcset: null,
  sizes: null,
});
