/* global sinon, axe */
import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/axe-component';
import { module, test } from 'qunit';

const { Application, Component, Logger, run } = Ember;
const ID_TEST_DOM_NODE = 'sign-up-button';

let application;
let sandbox;

function setupDOMNode(id = ID_TEST_DOM_NODE) {
  const node = document.createElement('div');

  node.setAttribute('id', id);
  document.body.appendChild(node);

  return node;
}

function stubA11yCheck(sandbox, callbackPayload) {
  sandbox.stub(axe, 'a11yCheck', function (el, options, callback) {
    callback(callbackPayload);
  });
}

function stubViolationOnDOMNode(sandbox, selector) {
  stubA11yCheck(sandbox, {
    violations: [{
      name: 'test',
      nodes: [
        { target: [selector] }
      ]
    }]
  });
}

module('Unit | Instance Initializer | axe-component', {
  beforeEach() {
    run(() => {
      application = Application.create({
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

test('initializer should not re-open Component more than once', function(assert) {
  // Depending on if the initializer has already ran, we will either expect the
  // reopen method to be called once or not at all.
  let assertMethod = Component.prototype.audit ? 'notCalled' : 'calledOnce';
  let reopenSpy = sandbox.spy(Component, 'reopen');

  initialize(application);
  initialize(application);

  assert.ok(reopenSpy[assertMethod]);
});


test('audit is run on didRender when not in testing mode', function(assert) {
  // In order for the audit to run, Ember.testing has to be false
  // when the component is initialized
  Ember.testing = false;
  console.log('Test for running audit: Calling initialize after setting Ember.testing to false');
  initialize(application, { forceRun: true });
  Ember.testing = true;

  console.log('Test for running audit: Creating component');
  let component = Ember.Component.create({});

  console.log('Test for running audit: Creating spy');
  let auditSpy = sandbox.spy(component, 'audit');

  console.log('Test for running audit: appending component');
  Ember.run(() => component.appendTo('#ember-testing'));

  console.log('Test for running audit: Testing spy after appending component');
  assert.ok(auditSpy.calledOnce);

  run(() => component.trigger('didRender'));

  console.log('Test for running audit: Testing spy after manually triggering `didRender`');
  assert.ok(auditSpy.calledTwice);

  run(() => component.destroy());
});

test('audit is not run on didRender when in testing mode', function(assert) {
  initialize(application, { forceRun: true });

  let component = Component.create({});
  let auditSpy = sandbox.spy(component, 'audit');

  run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.notCalled);

  run(() => component.destroy());
});

/* Component.turnAuditOff */

test('turnAuditOff prevents audit from running on didRender', function(assert) {
  initialize(application, { forceRun: true });

  let component = Component.create({ turnAuditOff: true });
  let auditSpy = sandbox.spy(component, 'audit');

  run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.notCalled);

  Ember.run(() => component.destroy());
});

/* Component.audit */

test('audit should log any violations found', function(assert) {
  stubA11yCheck(sandbox, {
    violations: [{
      name: 'test',
      nodes: []
    }]
  });

  const logSpy = sandbox.spy(Logger, 'error');
  const component = Component.create({});

  component.audit();

  assert.ok(logSpy.calledOnce);
});


test('audit should do nothing if no violations found', function(assert) {
  stubA11yCheck(sandbox, { violations: [] });

  const logSpy = sandbox.spy(Logger, 'error');
  const component = Component.create({});

  component.audit();

  assert.ok(logSpy.notCalled);
});

/* Component.axeCallback */

test('axeCallback receives the results of the audit', function(assert) {
  const results = { violations: [] };
  const axeCallbackSpy = sandbox.spy();
  const component = Component.create({
    axeCallback: axeCallbackSpy
  });

  stubA11yCheck(sandbox, results);
  component.audit();

  assert.ok(axeCallbackSpy.calledOnce);
  assert.ok(axeCallbackSpy.calledWith(results));
});

test('axeCallback throws an error if it is not a function', function(assert) {
  const results = { violations: [] };

  stubA11yCheck(sandbox, results);

  const component = Component.create({
    axeCallback: 'axeCallbackSpy'
  });

  assert.throws(() => component.audit(), 'axeCallback should be a function.');
});

/* Component.axeOptions */

test('axeOptions are passed in as the second param to a11yCheck', function(assert) {
  const a11yCheckStub = sandbox.stub(axe, 'a11yCheck');

  const axeOptions = { test: 'test' };
  const component = Component.create({ axeOptions });
  component.audit();

  assert.ok(a11yCheckStub.calledOnce);
  assert.ok(a11yCheckStub.calledWith(component.$(), axeOptions));
});

test('`axeViolationClassNames` are set on the violating element if they are defined', function (assert) {
  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode();
  const violationClassName = 'icon-left-shark';
  const component = Component.create({
    axeViolationClassNames: [violationClassName]
  });

  component.audit();

  assert.ok(dummyDOMNode.classList.contains(violationClassName));
  assert.notOk(
    dummyDOMNode.classList.contains('axe-violation'),
    'custom class names are used in lieu of `axe-violation`'
  );

  run(() => dummyDOMNode.remove());
});

test('`axeViolationClassNames` can be passed as a space-separated string (to aid template usage)', function (assert) {
  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);
  const component = Component.create({
    axeViolationClassNames: 'spark 🐋   foo  '
  });

  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  component.audit();
  assert.deepEqual([].slice.call(dummyDOMNode.classList), ['spark', '🐋', 'foo']);

  run(() => dummyDOMNode.remove());
});

test(`the component defaults to setting the \`axe-violation\` class on
  the element if no custom class names are set`, function (assert) {
  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode();
  const component = Component.create();

  component.audit();

  assert.ok(dummyDOMNode.classList.contains('axe-violation'));

  run(() => dummyDOMNode.remove());
});
