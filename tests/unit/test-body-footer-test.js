/* global QUnit, axe */
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

/* Registration */

test('appropriate callback functions have been registered', function(assert) {
  assert.ok(~QUnit.config.callbacks.done.indexOf(axe.ember.qunitDone));
  assert.ok(~QUnit.config.callbacks.moduleStart.indexOf(axe.ember.moduleStart));
});

/* axe.ember.a11yCheckCallback */

test('a11yCheckCallback shouldn\'t log anything if no violations', function(assert) {
  let loggerStub = sandbox.stub(Ember.Logger, 'error');

  axe.ember.a11yCheckCallback({ violations: [] });

  assert.ok(loggerStub.notCalled);
});

test('a11yCheckCallback should log any violations and throw an error', function(assert) {
  let loggerStub = sandbox.stub(Ember.Logger, 'error');

  assert.throws(() => {
    axe.ember.a11yCheckCallback({ violations: [ {}, {} ] });
  }, 'The page should have no accessibility violations.');

  assert.ok(loggerStub.calledTwice);
});

/* axe.ember.afterRender */

test('afterRender should run a11yCheck and feed the results to callback', function(assert) {
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck');

  axe.ember.afterRender();

  assert.ok(a11yCheckStub.calledOnce);
  assert.ok(a11yCheckStub.calledWith('#ember-testing-container', undefined, axe.ember.a11yCheckCallback));
});

test('afterRender should run a11yCheck with options and feed the results to callback', function(assert) {
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck');

  axe.ember.testOptions = {
    runOnly: {
        type: "tag",
        values: ["wcag2a"]
      }
  };

  axe.ember.afterRender();

  assert.ok(a11yCheckStub.calledOnce);
  assert.ok(a11yCheckStub.calledWith('#ember-testing-container', axe.ember.testOptions, axe.ember.a11yCheckCallback));

  axe.ember.testOptions = undefined;
});

/* axe.ember.moduleStart */

test('moduleStart turns axe on for acceptance tests', function(assert) {
  let turnAxeOnStub = sandbox.stub(axe.ember, 'turnAxeOn');

  axe.ember.moduleStart({ name: 'Acceptance | Some Test' });

  assert.ok(turnAxeOnStub.calledOnce);
});

test('moduleStart turns axe off for non-acceptance tests', function(assert) {
  let turnAxeOffStub = sandbox.stub(axe.ember, 'turnAxeOff');

  axe.ember.moduleStart({ name: 'Unit | Some Test' });

  assert.ok(turnAxeOffStub.calledOnce);
});

/* axe.ember.qunitDone */

test('qunitDone turns axe off', function(assert) {
  let turnAxeOffStub = sandbox.stub(axe.ember, 'turnAxeOff');

  axe.ember.qunitDone();

  assert.ok(turnAxeOffStub.calledOnce);
});

/* axe.ember.turnAxeOn */

test('turnAxeOn enables axe tests on afterRender and adjusts the display', function(assert) {
  axe.ember.turnAxeOn();
  assert.ok(document.body.classList.contains('axe-enabled'));
  assert.ok(Ember.run.backburner.options.render.after === axe.ember.afterRender);
});

/* axe.ember.turnAxeOff */
test('turnAxeOff disables axe tests on afterRender and resets the display', function(assert) {
  axe.ember.turnAxeOff();
  assert.ok(!document.body.classList.contains('axe-enabled'));
  assert.ok(Ember.run.backburner.options.render.after === undefined);
});
