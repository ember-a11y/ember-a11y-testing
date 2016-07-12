import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import sinon from 'sinon';

const { A } = Ember;

const IDs = {
  emptyButton: '#empty-button',
  sloppyInput: '#sloppy-input'
};


let actual, expected, sandbox;

moduleForAcceptance('Acceptance | violations', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('marking DOM nodes with violations', function(assert) {

  sandbox.stub(axe.ember, 'a11yCheckCallback', function (results) {
    actual = results.violations.length;
    expected = 2;

    assert.equal(actual, expected);

    const buttonNameViolation = A(results.violations).findBy('id', 'button-name');
    actual = buttonNameViolation.nodes[0].target[0];
    expected = IDs.emptyButton;

    assert.equal(actual, expected);
  });

  visit('/violations');

});

test('violationsHelper set in the global scope', function(assert) {

  // In order for the audit to run, we have to act like we're not in testing
  Ember.run(function() { Ember.testing = false; });

  visit('/violations');

  let logTipSpy;

  // ensures we set the spy before the 'afterRender' queue
  Ember.run.once(function() {
    logTipSpy = sandbox.spy(window.violationsHelper, 'logTip');
  });

  andThen(() => {
    assert.equal(window.violationsHelper.count, 2, "Two violations are found in the violationsHelper");

    assert.ok(logTipSpy.calledOnce, "logTip is only called once after all components are rendered and violations logged");

    // Turn testing mode back on to ensure validity of other tests
    Ember.run(function() { Ember.testing = true; });
  });

});
