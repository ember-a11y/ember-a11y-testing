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
});

export default Router;
