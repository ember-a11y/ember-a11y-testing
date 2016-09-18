import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('violations', { path: '/' });
  this.route('violations-helper');
});

export default Router;
