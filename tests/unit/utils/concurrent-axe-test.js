/* global sinon, axe */
import { module, test } from 'qunit';
import { ConcurrentAxe } from 'ember-a11y-testing/utils/concurrent-axe';
import { settled } from '@ember/test-helpers';

function setupDOMNode() {
  const node = document.createElement('div');
  document.body.appendChild(node);
  return node;
}

module('Unit | Utils | ConcurrentAxe', function(hooks) {
  hooks.before(function() {
    this.testOptions = { test: 'test' };
    this.testCallback = function(){};
  });

  hooks.beforeEach(function() {
    this.subject = new ConcurrentAxe();
    this.sandbox = sinon.sandbox.create();
    this.axeRunStub = this.sandbox.stub(axe, 'run');
    this.testNode = setupDOMNode();
  });

  hooks.afterEach(function() {
    this.sandbox.restore();
    this.axeRunStub = null;
    this.testNode.remove();
  });

  test('util calls axe.run with the correct arguments', async function(assert) {
    assert.expect(1);

    this.subject.run(this.testNode, this.testOptions, this.testCallback);

    await settled();
    assert.ok(this.axeRunStub.withArgs(this.testNode, this.testOptions, this.testCallback).calledOnce, 'called once with all arguments');
  });

  test('all concurrent axe.run calls are executed', async function(assert) {
    assert.expect(5);

    for (let i=0; i<3; i++) {
      this.subject.run(this.testNode, this.testOptions, this.testCallback);
    }

    assert.equal(this.subject._queue.length, 2, 'subsequent calls are placed in the queue');
    assert.ok(this.subject._timer, 'subsequent calls are scheduled for the next run loop');

    await settled();

    assert.ok(this.axeRunStub.calledThrice, 'axe.run is called thrice');
    assert.equal(this.subject._queue.length, 0, 'queue is cleared');
    assert.notOk(this.subject._timer, 'timer is cleared');
  });

  test('axe does not audit invalid DOM node', async function(assert) {
    assert.expect(1);

    const div = document.createElement('div');

    this.subject.run(undefined, this.testOptions, this.testCallback);
    this.subject.run({}, this.testOptions, this.testCallback);
    this.subject.run(div, this.testOptions, this.testCallback);

    this.testNode.remove();
    this.subject.run(this.testNode, this.testOptions, this.testCallback);

    await settled();
    assert.ok(this.axeRunStub.notCalled, 'axe.run is not called');
  });
});
