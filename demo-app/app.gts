import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';

class Router extends EmberRouter {
  location = 'history';
  rootURL = '/';
}

export class App extends EmberApp {
  modules = {
    './router': Router,
    ...import.meta.glob('./templates/**/*', { eager: true }),
  };
}

Router.map(function () {
  this.route('violations', { path: '/' });
  this.route('ignored-image-alt');
});
