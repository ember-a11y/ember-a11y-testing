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
