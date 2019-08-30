import { initialize } from 'dummy/instance-initializers/violations-helper';
import { module, test } from 'qunit';

let application;

module('Unit | Instance Initializer | violations-helper');

test('initializer sets a violationsHelper in the global scope', function(assert) {
  initialize(application);

  assert.ok(window.violationsHelper);
});
