/* global sinon, axe */
import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/axe-component';
import { module, test } from 'qunit';

const { Application, Component, Logger, run } = Ember;
const ID_TEST_DOM_NODE = 'sign-up-button';

const VIOLATION_CLASS__LEVEL_1 = 'axe-violation--level-1';
const VIOLATION_CLASS__LEVEL_2 = 'axe-violation--level-2';
const VIOLATION_CLASS__LEVEL_3 = 'axe-violation--level-3';
const VIOLATION_CLASS__REPLACED = 'axe-violation--replaced-element';

/*
 * Mapping of violation class names to their corresponding `visualNoiseLevel`
 */
const VIOLATION_CLASS_MAP = {
  LEVEL_1: VIOLATION_CLASS__LEVEL_1,
  LEVEL_2: VIOLATION_CLASS__LEVEL_2,
  LEVEL_3: VIOLATION_CLASS__LEVEL_3,
  REPLACED_ELEMENT: VIOLATION_CLASS__REPLACED
};


let application;
let sandbox;

function setupDOMNode(id = ID_TEST_DOM_NODE, tagName = 'div') {
  const node = document.createElement(tagName);

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
  initialize(application);

  let component = Component.create({});
  let auditSpy = sandbox.spy(component, 'audit');

  // In order for the audit to run, we have to act like we're not in testing
  Ember.testing = false;

  run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.calledOnce);

  run(() => component.trigger('didRender'));
  assert.ok(auditSpy.calledTwice);

  run(() => component.destroy());

  // Turn testing mode back on to ensure validity of other tests
  Ember.testing = true;
});

test('audit is not run on didRender when in testing mode', function(assert) {
  initialize(application);

  let component = Component.create({});
  let auditSpy = sandbox.spy(component, 'audit');

  run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.notCalled);

  run(() => component.destroy());
});

/* Component.turnAuditOff */

test('turnAuditOff prevents audit from running on didRender', function(assert) {
  initialize(application);

  let component = Component.create({ turnAuditOff: true });
  let auditSpy = sandbox.spy(component, 'audit');

  // In order for the audit to run, we have to act like we're not in testing
  Ember.testing = false;

  run(() => component.appendTo('#ember-testing'));
  assert.ok(auditSpy.notCalled);

  run(() => component.destroy());

  // Turn testing mode back on to ensure validity of other tests
  Ember.testing = true;
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

test('#violationClasses is computed from the current `visualNoiseLevel`', function(assert) {
  initialize(application);

  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);
  const component = Component.create();

  [1, 2, 3].forEach((currentNoiseLevel) => {
    run(() => {
      component.set('visualNoiseLevel', currentNoiseLevel);
    });

    component.audit();

    [1, 2, 3].forEach((_noiseLevel) => {
      const assertFunc = (_noiseLevel === currentNoiseLevel) ? 'ok' : 'notOk';
      assert[assertFunc](dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP[`LEVEL_${_noiseLevel}`], `assert ${assertFunc} for level ${_noiseLevel}`));
    });
  });

  run(() => dummyDOMNode.remove());
});

test('`axeViolationClassNames` can be passed as a space-separated string (to aid template usage)', function (assert) {
  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);
  const component = Component.create({
    axeViolationClassNames: 'spark 🐋   foo  '
  });

  component.audit();

  assert.deepEqual([].slice.call(dummyDOMNode.classList), ['spark', '🐋', 'foo']);

  run(() => dummyDOMNode.remove());
});

test('#violationClasses will always give precedence to a `axeViolationClassNames`, if it is set', function (assert) {
  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);
  const axeViolationClassNames = ['a11y-tomster', 'a11y-zoey'];

  const component = Component.create({ axeViolationClassNames });

  component.audit();

  axeViolationClassNames.forEach(className => {
   assert.ok(dummyDOMNode.classList.contains(className));
  });

  [1, 2, 3].forEach(noiseLevel => {
   assert.notOk(dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP[`LEVEL_${noiseLevel}`]));
  });

  run(() => dummyDOMNode.remove());
});

test('using default class names for violations when no `axeViolationClassNames` is provided', function (assert) {
  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);
  const component = Component.create();

  component.audit();

  assert.ok(dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP.LEVEL_1));

  run(() => dummyDOMNode.remove());
});

test(`smartly detects replaced elements and applies a special \`border-box\` style instead
of the styles from the current setting`, function(assert) {
  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const customViolationClass = 'foo';
  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE, 'img');
  const component = Component.create({ axeViolationClassNames: [customViolationClass] });

  component.audit();
  assert.ok(dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP.REPLACED_ELEMENT));
  assert.notOk(dummyDOMNode.classList.contains(customViolationClass));
});
