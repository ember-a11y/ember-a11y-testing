import Ember from 'ember';
import { module, test } from 'qunit';
import sinon from 'sinon';

let sandbox;

module('Unit | test-body-footer', {
  beforeEach: function() {
    sandbox = sinon.sandbox.create();
  },

  afterEach: function() {
    sandbox.restore();
  }
});

test('should run the function when visiting a new route', function(assert) {
  let test = sandbox.spy(Ember.run.backburner.options.render, 'after');
  assert.ok(test);
});
