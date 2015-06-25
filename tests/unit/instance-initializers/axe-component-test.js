/* global sinon, axe */
import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/axe-component';
import { module, test, skip } from 'qunit';

let application;
let sandbox;

module('Unit | Instance Initializer | axe-component', {
  beforeEach() {
    Ember.run(() => {
      application = Ember.Application.create({
        rootElement: '#ember-testing'
      });
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
  // Depending on if the initializer has already ran, we will either expect the
  // reopen method to be called once or not at all.
  let assertMethod = Ember.Component.prototype.audit ? 'notCalled' : 'calledOnce';
  let reopenSpy = sandbox.spy(Ember.Component, 'reopen');

  initialize(application);
  initialize(application);

  assert.ok(reopenSpy[assertMethod]);
});

test('audit is run on didRender when not in testing mode', function(assert) {
  initialize(application);

  let component = Ember.Component.create({});
  let auditSpy = sandbox.spy(component, 'audit');

  // In order for the audit to run, we have to act like we're not in testing
  Ember.testing = false;

  Ember.run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.calledOnce);

  Ember.run(() => component.trigger('didRender'));
  assert.ok(auditSpy.calledTwice);

  Ember.run(() => component.destroy());

  // Turn testing mode back on to ensure validity of other tests
  Ember.testing = true;
});

test('audit is not run on didRender when in testing mode', function(assert) {
  initialize(application);

  let component = Ember.Component.create({});
  let auditSpy = sandbox.spy(component, 'audit');

  Ember.run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.notCalled);

  Ember.run(() => component.destroy());
});

/* Ember.Component.turnAuditOff */

test('turnAuditOff prevents audit from running on didRender', function(assert) {
  initialize(application);

  let component = Ember.Component.create({ turnAuditOff: true });
  let auditSpy = sandbox.spy(component, 'audit');

  // In order for the audit to run, we have to act like we're not in testing
  Ember.testing = false;

  Ember.run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.notCalled);

  Ember.run(() => component.destroy());

  // Turn testing mode back on to ensure validity of other tests
  Ember.testing = true;
});

/* Ember.Component.audit */

test('audit should log any violations found', function(assert) {
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck', function(el, options, callback) {
    callback({
      violations: [{
        name: 'test',
        nodes: []
      }]
    });
  });

  let logSpy = sandbox.spy(Ember.Logger, 'error');

  let component = Ember.Component.create({});
  component.audit();

  assert.ok(logSpy.calledOnce);
});

skip('audit should mark the DOM nodes of any violations', function(assert) {

});

test('audit should do nothing if no violations found', function(assert) {
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck', function(el, options, callback) {
    callback({
      violations: []
    });
  });

  let logSpy = sandbox.spy(Ember.Logger, 'error');

  let component = Ember.Component.create({});
  component.audit();

  assert.ok(logSpy.notCalled);
});

/* Ember.Component.axeCallback */

test('axeCallback receives the results of the audit', function(assert) {
  let results = { violations: [] };
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck', (el, opts, callback) => {
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
  let results = { violations: [] };
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck', (el, opts, callback) => {
    callback(results);
  });

  let component = Ember.Component.create({
    axeCallback: 'axeCallbackSpy'
  });

  assert.throws(() => component.audit(), 'axeCallback should be a function.');
});

/* Ember.Component.axeOptions */

test('axeOptions are passed in as the second param to a11yCheck', function(assert) {
  let a11yCheckStub = sandbox.stub(axe, 'a11yCheck');

  let axeOptions = { test: 'test' };
  let component = Ember.Component.create({ axeOptions });
  component.audit();

  assert.ok(a11yCheckStub.calledOnce);
  assert.ok(a11yCheckStub.calledWith(component.$(), axeOptions));
});
