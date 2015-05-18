import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('alt-text');
  this.route('form-labels');
  this.route('no-read');
  this.route('a11y-test');
  this.route('aria-properties');
  this.route('id-checks');
  this.route('links');
  this.route('color-contrast');
  this.route('actions');
});

export default Router;
