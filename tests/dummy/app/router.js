import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('alt-text');
  this.route('form-labels');
  this.route('no-read');
});

export default Router;
