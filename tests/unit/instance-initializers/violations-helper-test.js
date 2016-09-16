/* global sinon */
import { initialize } from 'dummy/instance-initializers/violations-helper';
import { module, test } from 'qunit';

let application;
let sandbox;

module('Unit | Instance Initializer | violations-helper', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('initializer sets a violationsHelper in the global scope', function(assert) {
  initialize(application);

  assert.ok(window.violationsHelper);
});
