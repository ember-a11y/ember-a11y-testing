import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import sinon from 'sinon';

const { run } = Ember;

let sandbox;

moduleForAcceptance('Acceptance | violations helper', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('violationsHelper set in the global scope', function(assert) {

  // In order for the audit to run, we have to act like we're not in testing
  run(function() { Ember.testing = false; });

  visit('/violations-helper');

  let logTipSpy;

  // ensures we set the spy before the 'afterRender' queue
  run.once(function() {
    logTipSpy = sandbox.spy(window.violationsHelper, 'logTip');
  });

  andThen(() => {
    assert.equal(window.violationsHelper.count, 2, "Two violations are found in the violationsHelper");

    assert.ok(logTipSpy.calledOnce, "logTip is only called once after all components are rendered and violations logged");

    // Turn testing mode back on to ensure validity of other tests
    run(function() { Ember.testing = true; });
  });

});
