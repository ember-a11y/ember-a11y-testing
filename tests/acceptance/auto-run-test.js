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

  visit('/').then(() => {

    assert.ok(callbackStub.calledOnce);
    assert.equal(currentPath(), 'violations');

    click(`${SELECTORS.passingComponent}`);

    andThen(() => {
      assert.ok(callbackStub.calledTwice);
    });
  });
});
