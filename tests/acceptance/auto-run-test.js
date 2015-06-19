import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import sinon from 'sinon';

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
  let test = sandbox.spy(Ember.run.backburner.options.render, 'after');

  visit('/');

  andThen(function() {
    assert.ok(test.calledOnce);
    assert.equal(currentPath(), 'index');
  });
});

test('should run the function when visiting a new route', function(assert) {
  let test = sandbox.spy(Ember.run.backburner.options.render, 'after');

  visit('/');

  andThen(function() {
    assert.ok(test.calledOnce);
    assert.equal(currentPath(), 'index');
  });
});
