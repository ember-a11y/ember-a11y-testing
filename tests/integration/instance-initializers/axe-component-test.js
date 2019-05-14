/* global sinon, axe */
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Component from '@ember/component';
import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/axe-component';
import {
  initialize as initializeViolationsHelper
} from 'dummy/instance-initializers/violations-helper';

const {
  Logger
} = Ember;
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
  sandbox.stub(axe, 'run').callsFake(function(el, options, callback) {
    callback(undefined, callbackPayload);
  });
}

function stubViolationOnDOMNode(sandbox, selector) {
  stubA11yCheck(sandbox, {
    violations: [{
      name: 'test',
      impact: 'critical',
      help: 'it should be better',
      helpUrl: 'http://example.com',
      nodes: [
        { target: [selector] }
      ]
    }]
  });
}

async function setupVisualNoiseLevel(visualNoiseLevel) {
  initializeViolationsHelper();
  stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);
  const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);

  this.set('visualNoiseLevel', visualNoiseLevel);
  await render(hbs`{{axe-component visualNoiseLevel=visualNoiseLevel}}`);

  return dummyDOMNode;
}

function assertVisualNoiseLevel(assert, visualNoiseLevel, dummyDOMNode) {
  [1, 2, 3].forEach((_noiseLevel) => {
    const assertFunc = (_noiseLevel === visualNoiseLevel) ? 'ok' : 'notOk';
    assert[assertFunc](dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP[`LEVEL_${_noiseLevel}`], `assert ${assertFunc} for level ${_noiseLevel}`));
  });

  dummyDOMNode.remove();
}


module('Integration | Instance Initializer | axe-component', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(){
    // In order for the audit to run, we have to act like we're not in testing
    Ember.testing = false;

    initialize();
    sandbox = sinon.sandbox.create();
  });

  hooks.afterEach(function(){
    sandbox.restore();

    // Turn testing mode back on to ensure validity of other tests
    Ember.testing = true;
  });

  test('initializer should not re-open Component more than once', function(assert) {
    // Since the initializer has already ran, we expect reopen to not be called
    let reopenSpy = sandbox.spy(Component, 'reopen');

    initialize();

    assert.ok(reopenSpy.notCalled);
  });

  test('audit is run on didRender when not in testing mode', async function(assert) {
    let auditSpy = sandbox.spy();
    this.set('auditSpy', auditSpy);
    this.set('content', 'derp');

    await render(hbs`{{#axe-component audit=auditSpy}}{{content}}{{/axe-component}}`);

    assert.ok(auditSpy.calledOnce, 'audit is called on render');
  });

  test('audit is not run on didRender when in testing mode', async function(assert) {
    Ember.testing = true;

    let auditSpy = sandbox.spy();
    this.set('auditSpy', auditSpy);
    this.set('content', 'derp');

    await render(hbs`{{#axe-component audit=auditSpy}}{{content}}{{/axe-component}}`);

    assert.ok(auditSpy.notCalled);

    Ember.testing = false;
  });

  /* Component.turnAuditOff */

  test('turnAuditOff prevents audit from running on didRender', async function(assert) {
    let auditSpy = sandbox.spy();
    this.set('auditSpy', auditSpy);
    this.set('content', 'derp');

    await render(hbs`{{#axe-component audit=auditSpy turnAuditOff=true}}{{content}}{{/axe-component}}`);

    assert.ok(auditSpy.notCalled);
  });

  /* Component.audit */

  test('audit should log any violations found', async function(assert) {
    initializeViolationsHelper();

    stubA11yCheck(sandbox, {
      violations: [{
        name: 'test',
        impact: 'critical',
        help: 'it should be better',
        helpUrl: 'http://example.com',
        nodes: [
          {
            target:
            [
              '#ember-testing'
            ]
          }
        ]
      }]
    });

    const logSpy = sandbox.spy(Logger, 'error');
    await render(hbs`{{#axe-component}}{{content}}{{/axe-component}}`);

    assert.ok(logSpy.calledOnce);
  });

  test('audit should log any violations found if no nodes are found', async function(assert) {
    initializeViolationsHelper();

    stubA11yCheck(sandbox, {
      violations: [{
        name: 'test',
        impact: 'critical',
        help: 'it should be better',
        helpUrl: 'http://example.com',
        nodes: []
      }]
    });

    const logSpy = sandbox.spy(Logger, 'error');
    await render(hbs`{{#axe-component}}{{content}}{{/axe-component}}`);
    assert.ok(logSpy.calledOnce);
  });

  test('audit should do nothing if no violations found', async function(assert) {
    initializeViolationsHelper();

    stubA11yCheck(sandbox, { violations: [] });

    const logSpy = sandbox.spy(Logger, 'error');
    await render(hbs`{{#axe-component}}{{content}}{{/axe-component}}`);

    assert.ok(logSpy.notCalled);
  });

  /* Component.axeCallback */

  test('axeCallback receives the results of the audit', async function(assert) {
    initializeViolationsHelper();

    const results = { violations: [] };
    stubA11yCheck(sandbox, results);

    const axeCallbackSpy = sandbox.spy();
    this.set('axeCallbackSpy', axeCallbackSpy);

    await render(hbs`{{#axe-component axeCallback=axeCallbackSpy}}{{content}}{{/axe-component}}`);

    assert.ok(axeCallbackSpy.calledOnce);
    assert.ok(axeCallbackSpy.calledWith(results));
  });

  test('axeCallback throws an error if it is not a function', async function(assert) {
    const results = { violations: [] };
    const a11yCheckStub = sandbox.stub(axe, 'run').callsFake(function(el, options, callback) {
      assert.throws(() => callback(undefined, results), /axeCallback should be a function./);
    });

    await render(hbs`{{#axe-component axeCallback='axeCallbackSpy'}}{{content}}{{/axe-component}}`);

    assert.ok(a11yCheckStub.calledOnce);
  });

  /* Component.axeOptions */

  test('axeOptions are passed in as the second param to a11yCheck', async function(assert) {
    const a11yCheckStub = sandbox.stub(axe, 'run');
    const axeOptions = { test: 'test' };
    this.set('axeOptions', axeOptions);

    await render(hbs`{{axe-component class="component" axeOptions=axeOptions}}`);

    assert.ok(a11yCheckStub.calledOnce);
    assert.ok(a11yCheckStub.calledWith(sinon.match.any, axeOptions));
  });

  test('#violationClass is computed from `visualNoiseLevel` 1', async function(assert) {
    const visualNoiseLevel = 1;
    const dummyDOMNode = await setupVisualNoiseLevel.call(this, visualNoiseLevel);

    assertVisualNoiseLevel(assert, visualNoiseLevel, dummyDOMNode);
  });

  test('#violationClass is computed from `visualNoiseLevel` 2', async function(assert) {
    const visualNoiseLevel = 2;
    const dummyDOMNode = await setupVisualNoiseLevel.call(this, visualNoiseLevel);

    assertVisualNoiseLevel(assert, visualNoiseLevel, dummyDOMNode);
  });

  test('#violationClass is computed from `visualNoiseLevel` 3', async function(assert) {
    const visualNoiseLevel = 3;
    const dummyDOMNode = await setupVisualNoiseLevel.call(this, visualNoiseLevel);

    assertVisualNoiseLevel(assert, visualNoiseLevel, dummyDOMNode);
  });

  test('`axeViolationClassNames` can be passed as a space-separated string (to aid template usage)', async function(assert) {
    initializeViolationsHelper();

    stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

    const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);

    this.set('axeViolationClassNames', 'spark 🐋   foo  ');
    await render(hbs`{{axe-component axeViolationClassNames=axeViolationClassNames}}`);

    assert.deepEqual([].slice.call(dummyDOMNode.classList), ['spark', '🐋', 'foo']);
    dummyDOMNode.remove();
  });

  test('#violationClasses will always give precedence to a `axeViolationClassNames`, if it is set', async function(assert) {
    initializeViolationsHelper();

    stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

    const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);

    const axeViolationClassNames = ['a11y-tomster', 'a11y-zoey'];
    this.set('axeViolationClassNames', axeViolationClassNames);
    await render(hbs`{{axe-component axeViolationClassNames=axeViolationClassNames}}`);

    axeViolationClassNames.forEach(className => {
      assert.ok(dummyDOMNode.classList.contains(className));
    });

    [1, 2, 3].forEach(noiseLevel => {
      assert.notOk(dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP[`LEVEL_${noiseLevel}`]));
    });

    dummyDOMNode.remove();
  });

  test('using default class names for violations when no `axeViolationClassNames` is provided', async function(assert) {
    initializeViolationsHelper();

    stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

    const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE);

    await render(hbs`{{axe-component}}`);

    assert.ok(dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP.LEVEL_1));
    dummyDOMNode.remove();
  });

  test(`smartly detects replaced elements and applies a special \`border-box\` style instead of the styles from the current setting`, async function(assert) {
    initializeViolationsHelper();

    stubViolationOnDOMNode(sandbox, `#${ID_TEST_DOM_NODE}`);

    const customViolationClass = 'foo';
    const dummyDOMNode = setupDOMNode(ID_TEST_DOM_NODE, 'img');

    this.set('axeViolationClassNames', [customViolationClass]);
    await render(hbs`{{axe-component axeViolationClassNames=axeViolationClassNames}}`);

    assert.ok(dummyDOMNode.classList.contains(VIOLATION_CLASS_MAP.REPLACED_ELEMENT));
    assert.notOk(dummyDOMNode.classList.contains(customViolationClass));

    dummyDOMNode.remove();
  });
});
