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

/* registration */

test('appropriate callback functions have been registered', function(assert) {
  assert.ok(~QUnit.config.callbacks.done.indexOf(axe.ember.qunitDone));
  assert.ok(~QUnit.config.callbacks.moduleStart.indexOf(axe.ember.moduleStart));
  assert.ok(Ember.run.backburner.options.render.after === axe.ember.afterRender);
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
  assert.ok(a11yCheckStub.calledWith('#ember-testing-container', axe.ember.a11yCheckCallback));
});

/* axe.ember.moduleStart */

test('moduleStart adjusts the layout of the container for acceptance tests', function(assert) {
  document.body.classList.remove('axe-enabled');

  axe.ember.moduleStart({ name: 'Acceptance | Some Test' });

  assert.ok(document.body.classList.contains('axe-enabled'));
});

test('moduleStart resets the layout of the container for non-acceptance tests', function(assert) {
  document.body.classList.add('axe-enabled');

  axe.ember.moduleStart({ name: 'Unit | Some Test' });

  assert.ok(!document.body.classList.contains('axe-enabled'));
});

/* axe.ember.qunitDone */

test('qunitDone resets the layout of the container', function(assert) {
  document.body.classList.add('axe-enabled');

  axe.ember.qunitDone();

  assert.ok(!document.body.classList.contains('axe-enabled'));
});
