import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import sinon from 'sinon';

const { run } = Ember;

const SELECTORS = {
  passingComponent: '[data-test-selector="violations-page__passing-component"]'
};

let application;
let sandbox;

module('Acceptance | auto-run', {
  beforeEach: function() {
    application = startApp();
    sandbox = sinon.sandbox.create();
  },

  afterEach: function() {
    sandbox.restore();
    Ember.run(application, 'destroy');
  }
});

test('should run the function when visiting a new route', function(assert) {
  const callbackStub = sandbox.stub(run.backburner.options.render, 'after');

  visit('/');

  andThen(() => {
    assert.ok(callbackStub.calledOnce);
    assert.equal(currentPath(), 'violations');
  });
});

test('should run the function whenever a render occurs', function(assert) {
  const callbackStub = sandbox.stub(run.backburner.options.render, 'after');
  let callCount = 0;

  visit('/');

  andThen(() => {
    callCount = callbackStub.callCount;
    assert.ok(callCount > 0, 'afterRender called at least once for initial visit');
    assert.equal(currentPath(), 'violations');
  });

  click(SELECTORS.passingComponent);

  andThen(() => {
    assert.ok(callbackStub.callCount > callCount, 'afterRender called more than before');
  });
});
