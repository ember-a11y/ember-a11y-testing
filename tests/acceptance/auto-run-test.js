import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import sinon from 'sinon';

let application;
let sandbox;

const SELECTORS = {
  passingInput: '[data-test-selector="passing-input"]'
};

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
  let callbackStub = sandbox.stub(Ember.run.backburner.options.render, 'after');

  visit('/');

  andThen(() => {
    assert.ok(callbackStub.calledOnce);
    assert.equal(currentPath(), 'index');
  });
});

test('should run the function whenever a render occurs', function(assert) {
  let callbackStub = sandbox.stub(Ember.run.backburner.options.render, 'after');

  visit('/');

  andThen(() => {
    assert.ok(callbackStub.calledOnce);
    assert.equal(currentPath(), 'index');
  });

  click(`${SELECTORS.passingInput} label`);

  andThen(() => {
    assert.ok(callbackStub.calledTwice);
  });
});
