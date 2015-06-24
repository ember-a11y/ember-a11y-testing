import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/axe-component';
import { module, test } from 'qunit';

let application;
let sandbox;

module('Unit | Instance Initializer | axe-component', {
  beforeEach() {
    Ember.run(() => {
      application = Ember.Application.create();
      application.deferReadiness();
    });

    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

/* Basic Behavior */

test('initializer should not re-open Ember.Component more than once', function(assert) {
  let reopenSpy = sandbox.spy(Ember.Component, 'reopen');

  initialize(application);
  initialize(application);

  assert.ok(reopenSpy.calledOnce);
});

test('audit is run on render when not in testing mode', function(assert) {
  initialize(application);

  let component = Ember.Component.create({});
  let auditSpy = sandbox.spy(component, 'audit');

  // In order for the audit to run, we have to act like we're not in testing
  Ember.testing = false;

  Ember.run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.calledOnce);

  Ember.run(() => component.rerender());
  assert.ok(auditSpy.calledTwice);

  component.destroy();

  Ember.testing = true;
});

test('audit is not run on render when in testing mode', function(assert) {
  initialize(application);

  let component = Ember.Component.create({});
  let auditSpy = sandbox.spy(component, 'audit');

  Ember.run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.notCalled);

  component.destroy();
});

/* Ember.Component.turnAuditOff */

test('turnAuditOff prevents audit from running after a render', function(assert) {
  initialize(application);

  let component = Ember.Component.create({ turnAuditOff: true });
  let auditSpy = sandbox.spy(component, 'audit');

  // In order for the audit to run, we have to act like we're not in testing
  Ember.testing = false;

  Ember.run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.notCalled);

  component.destroy();

  Ember.testing = true;
});

/* Ember.Component.audit */

test('audit should log any violations found and mark offending DOM nodes', function(assert) {
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck', function(el, options, callback) {
    callback({
      violations: [{
        name: 'test',
        nodes: []
      }]
    })
  });

  let logSpy = sandbox.spy(Ember.Logger, 'error');

  let component = Ember.Component.create({});
  component.audit();

  assert.ok(logSpy.calledOnce);
});

test('audit should do nothing if no violations found', function(assert) {
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck', function(el, options, callback) {
    callback({
      violations: []
    })
  });

  let logSpy = sandbox.spy(Ember.Logger, 'error');

  let component = Ember.Component.create({});
  component.audit();

  assert.ok(logSpy.notCalled);
});

/* Ember.Component.axeCallback */

test('axeCallback receives the results of the audit', function(assert) {
  let results = { violations: [] };
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck', function(el, options, callback) {
    callback(results);
  });

  let axeCallbackSpy = sandbox.spy();
  let component = Ember.Component.create({
    axeCallback: axeCallbackSpy
  });
  component.audit();

  assert.ok(axeCallbackSpy.calledOnce);
  assert.ok(axeCallbackSpy.calledWith(results));
});

test('axeCallback throws an error if it is not a function', function(assert) {

});

/* Ember.Component.axeOptions */

test('axeOptions are passed in as the second param to a11yCheck', function(assert) {
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck');

  let axeOptions = { test: 'test' }
  let component = Ember.Component.create({ axeOptions });
  component.audit();

  assert.ok(a11yCheckStub.calledOnce);
  assert.ok(a11yCheckStub.calledWith(component.$(), axeOptions));
});
