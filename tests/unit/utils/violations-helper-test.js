/* global sinon */
import { module, test } from 'qunit';
import { ViolationsHelper } from 'ember-a11y-testing/utils/violations-helper';
import Ember from 'ember';

let sandbox;

module('Unit | Utils | ViolationsHelper', function(hooks) {
  hooks.beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  hooks.afterEach(function(){
    sandbox.restore();
  });

  test('initializes with a violations array', function(assert) {
    let violationsHelper = new ViolationsHelper();
    let violationsHelperWithArguments = new ViolationsHelper('error');

    assert.deepEqual(violationsHelper.violations, []);
    assert.deepEqual(violationsHelperWithArguments.violations, ['error']);
  });

  /* Alias methods */

  test('count', function(assert) {
    let violationsHelper = new ViolationsHelper('error');

    assert.equal(violationsHelper.count, 1);
  });

  test('first', function(assert) {
    let violationsHelper = new ViolationsHelper('error', 'failure');

    assert.equal(violationsHelper.first, 'error');
  });

  test('last', function(assert) {
    let violationsHelper = new ViolationsHelper('error', 'failure');

    assert.equal(violationsHelper.last, ['failure']);
  });

  test('push', function(assert) {
    let violationsHelper = new ViolationsHelper();
    violationsHelper.push('error');

    assert.deepEqual(violationsHelper.violations, ['error']);
  });

  /* filterBy */

  test('filterBy rule', function(assert) {
    let colorContrastViolation = { id: 'color-contrast' };
    let violationsHelper = new ViolationsHelper(colorContrastViolation);

    assert.deepEqual(violationsHelper.filterBy('rule', 'color-contrast'), [colorContrastViolation], "converts 'rule' key to 'id'");
  });

  test('filterBy impact', function(assert) {
    let colorContrastViolation = { id: 'color-contrast', impact: 'critical' };
    let buttonNameViolation = { id: 'button-name', impact: 'critical' };
    let violationsHelper = new ViolationsHelper(colorContrastViolation, buttonNameViolation);

    assert.deepEqual(violationsHelper.filterBy('impact', 'critical'), [colorContrastViolation, buttonNameViolation], "returns all violations that match the key-value pair");
  });

  test('filterBy node', function(assert) {
    let sloppyInput = { nodes: [ { target: ['#sloppy-input'] } ] };
    let violationsHelper = new ViolationsHelper(sloppyInput);

    assert.deepEqual(violationsHelper.filterBy('node', '#sloppy-input'), [sloppyInput], "returns violations attached to the matching node");
  });


  /* logTip */

  test('only logs tip if there are violations', function(assert) {
    let violationsHelper = new ViolationsHelper();
    let loggerInfoSpy = sandbox.spy(Ember.Logger, 'info');

    violationsHelper.logTip();
    assert.ok(!loggerInfoSpy.called, "Nothing is logged if there are no violations");

    violationsHelper.push('violation');

    violationsHelper.logTip();
    assert.ok(loggerInfoSpy.called);
  });

  test('will not log tip more than once', function(assert) {
    let violationsHelper = new ViolationsHelper('violation');
    let loggerInfoSpy = sandbox.spy(Ember.Logger, 'info');

    violationsHelper.logTip();
    assert.ok(loggerInfoSpy.called);

    let firstCallCount = loggerInfoSpy.callCount;

    violationsHelper.logTip();
    assert.equal(loggerInfoSpy.callCount, firstCallCount, "does not log anymore after the first time");
  });
});
