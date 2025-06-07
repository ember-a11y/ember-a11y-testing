import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import { setupConsoleLogger } from '#src/test-support';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

// Import demo-app templates and remap keys so the resolver can find them.
// import.meta.glob produces keys like '../demo-app/templates/violations.gts',
// but the resolver expects './templates/violations'.
const demoAppModules = Object.fromEntries(
  Object.entries(
    import.meta.glob('../demo-app/templates/**/*.gts', { eager: true }),
  ).map(([key, mod]) => [key.replace('../demo-app/', './'), mod]),
);

class TestApp extends EmberApp {
  modules = {
    './router': Router,
    ...demoAppModules,
  };
}

Router.map(function () {
  this.route('violations', { path: '/' });
  this.route('ignored-image-alt');
});

export function start() {
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing',
    }),
  );
  setup(QUnit.assert);
  setupEmberOnerrorValidation();
  setupConsoleLogger();
  qunitStart();
}
