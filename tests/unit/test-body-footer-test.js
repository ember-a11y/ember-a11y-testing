/* global QUnit, axe */
import Ember from 'ember';
import RSVP from 'rsvp';
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
  }, 'The page should have no accessibility violations. Please check the developer console for more details.');

  assert.equal(loggerStub.callCount, 1, 'An error is thrown when there are violations');
});

/* axe.ember.afterRender */

test('afterRender should run axe.run and feed the results to callback', function(assert) {
  let runStub = sandbox.stub(axe, 'run').returns(RSVP.Promise.resolve({ violations: [] }));

  return axe.ember.afterRender().then(() => {
    assert.ok(runStub.calledOnce);
    assert.ok(runStub.calledWith('#ember-testing-container', undefined));
  });
});

test('afterRender should run axe.run with options and feed the results to callback', function(assert) {
  let runStub = sandbox.stub(axe, 'run').returns(RSVP.Promise.resolve({ violations: [] }));

  axe.ember.testOptions = {
    runOnly: {
        type: "tag",
        values: ["wcag2a"]
      }
  };

  return axe.ember.afterRender().then(() => {
    assert.ok(runStub.calledOnce);
    assert.ok(runStub.calledWith('#ember-testing-container', axe.ember.testOptions));

    axe.ember.testOptions = undefined;
  });
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
