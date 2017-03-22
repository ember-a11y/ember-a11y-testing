/* global sinon, axe */
import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/axe-component';
import { initialize as initializeViolationsHelper } from 'dummy/instance-initializers/violations-helper';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { Component, Logger } = Ember;
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

// We use a component integration test to verify the behavior of axe-component
// instance initializer since we are concerned with component behavior.
moduleForComponent('component:axe-component', 'Integration | Instance Initializer | axe-component', {
  integration: true,

  beforeEach() {
    // In order for the audit to run, we have to act like we're not in testing
    Ember.testing = false;

    initialize();
    this.register('component:axe-component', Component.extend());
    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();

    // Turn testing mode back on to ensure validity of other tests
    Ember.testing = true;
  }
});

/* Basic Behavior */

test('initializer should not re-open Component more than once', function(assert) {
  // Since the initializer has already ran, we expect reopen to not be called
  let reopenSpy = sandbox.spy(Component, 'reopen');

  initialize();

  assert.ok(reopenSpy.notCalled);
});

test('audit is run on didRender when not in testing mode', function(assert) {
  let auditSpy = sandbox.spy();
  this.set('auditSpy', auditSpy);
  this.set('content', 'derp');
  this.render(hbs`{{#axe-component audit=auditSpy}}{{content}}{{/axe-component}}`);

  assert.ok(auditSpy.calledOnce, 'audit is called on render');
});

test('audit is not run on didRender when in testing mode', function(assert) {
  Ember.testing = true;

  let auditSpy = sandbox.spy();
  this.set('auditSpy', auditSpy);
  this.set('content', 'derp');
  this.render(hbs`{{#axe-component audit=auditSpy}}{{content}}{{/axe-component}}`);
  assert.ok(auditSpy.notCalled);
});

/* Component.turnAuditOff */

test('turnAuditOff prevents audit from running on didRender', function(assert) {
  let auditSpy = sandbox.spy();
  this.set('auditSpy', auditSpy);
  this.set('content', 'derp');
  this.render(hbs`{{#axe-component audit=auditSpy turnAuditOff=true}}{{content}}{{/axe-component}}`);

  assert.ok(auditSpy.notCalled);
});

/* Component.audit */

test('audit should log any violations found', function(assert) {
  initializeViolationsHelper();

  stubA11yCheck(sandbox, {
    violations: [{
      name: 'test',
      nodes: []
    }]
  });

  const logSpy = sandbox.spy(Logger, 'error');
  this.render(hbs`{{#axe-component}}{{content}}{{/axe-component}}`);

  assert.ok(logSpy.calledOnce);
});


test('audit should do nothing if no violations found', function(assert) {
  initializeViolationsHelper();

  stubA11yCheck(sandbox, { violations: [] });

  const logSpy = sandbox.spy(Logger, 'error');
  this.render(hbs`{{#axe-component}}{{content}}{{/axe-component}}`);

  assert.ok(logSpy.notCalled);
});

/* Component.axeCallback */

test('axeCallback receives the results of the audit', function(assert) {
  initializeViolationsHelper();

  const results = { violations: [] };
  stubA11yCheck(sandbox, results);

  const axeCallbackSpy = sandbox.spy();
  this.set('axeCallbackSpy', axeCallbackSpy);
  this.render(hbs`{{#axe-component axeCallback=axeCallbackSpy}}{{content}}{{/axe-component}}`);

  assert.ok(axeCallbackSpy.calledOnce);
  assert.ok(axeCallbackSpy.calledWith(results));
});

test('axeCallback throws an error if it is not a function', function(assert) {
  const results = { violations: [] };

  sandbox.stub(axe, 'a11yCheck', function (el, options, callback) {
    assert.throws(() => {
      callback(results);
    }, /axeCallback should be a function./);
  });

  this.render(hbs`{{#axe-component axeCallback='axeCallbackSpy'}}{{content}}{{/axe-component}}`);
});

/* Component.axeOptions */

test('axeOptions are passed in as the second param to a11yCheck', function(assert) {
  const a11yCheckStub = sandbox.stub(axe, 'a11yCheck');
  const axeOptions = { test: 'test' };
  this.set('axeOptions', axeOptions);
  this.render(hbs`{{axe-component class="component" axeOptions=axeOptions}}`);

  assert.ok(a11yCheckStub.calledOnce);
  assert.ok(a11yCheckStub.calledWith(sinon.match.any, axeOptions));
});

test('#violationClasses is computed from the current `visualNoiseLevel`', function(assert) {
  initializeViolationsHelper();

  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);

  [1, 2, 3].forEach((currentNoiseLevel) => {
    this.set('visualNoiseLevel', currentNoiseLevel);
    this.render(hbs`{{axe-component visualNoiseLevel=visualNoiseLevel}}`);

    [1, 2, 3].forEach((_noiseLevel) => {
      const assertFunc = (_noiseLevel === currentNoiseLevel) ? 'ok' : 'notOk';
      assert[assertFunc](dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP[`LEVEL_${_noiseLevel}`], `assert ${assertFunc} for level ${_noiseLevel}`));
    });
  });

  dummyDOMNode.remove();
});

test('`axeViolationClassNames` can be passed as a space-separated string (to aid template usage)', function (assert) {
  initializeViolationsHelper();

  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);

  this.set('axeViolationClassNames', 'spark 🐋   foo  ');
  this.render(hbs`{{axe-component axeViolationClassNames=axeViolationClassNames}}`);

  assert.deepEqual([].slice.call(dummyDOMNode.classList), ['spark', '🐋', 'foo']);

  dummyDOMNode.remove();
});

test('#violationClasses will always give precedence to a `axeViolationClassNames`, if it is set', function (assert) {
  initializeViolationsHelper();

  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);

  const axeViolationClassNames = ['a11y-tomster', 'a11y-zoey'];
  this.set('axeViolationClassNames', axeViolationClassNames);
  this.render(hbs`{{axe-component axeViolationClassNames=axeViolationClassNames}}`);

  axeViolationClassNames.forEach(className => {
   assert.ok(dummyDOMNode.classList.contains(className));
  });

  [1, 2, 3].forEach(noiseLevel => {
   assert.notOk(dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP[`LEVEL_${noiseLevel}`]));
  });

  dummyDOMNode.remove();
});

test('using default class names for violations when no `axeViolationClassNames` is provided', function (assert) {
  initializeViolationsHelper();

  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);

  this.render(hbs`{{axe-component}}`);

  assert.ok(dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP.LEVEL_1));

  dummyDOMNode.remove();
});

test(`smartly detects replaced elements and applies a special \`border-box\` style instead
of the styles from the current setting`, function(assert) {
  initializeViolationsHelper();

  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

  const customViolationClass = 'foo';
  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE, 'img');

  this.set('axeViolationClassNames', [customViolationClass]);
  this.render(hbs`{{axe-component axeViolationClassNames=axeViolationClassNames}}`);

  assert.ok(dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP.REPLACED_ELEMENT));
  assert.notOk(dummyDOMNode.classList.contains(customViolationClass));

  dummyDOMNode.remove();
});
