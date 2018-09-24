/* global sinon, axe */
import { moduleFor, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';

function setupDOMNode() {
  const node = document.createElement('div');
  document.body.appendChild(node);
  return node;
}

moduleFor('service:concurrent-axe', 'Unit | Service | concurrent axe', {
  before() {
    this.testOptions = { test: 'test' };
    this.testCallback = function(){};
  },
  beforeEach() {
    this.sandbox = sinon.sandbox.create();
    this.axeRunStub = this.sandbox.stub(axe, 'run');
    this.testNode = setupDOMNode();
  },
  afterEach() {
    this.sandbox.restore();
    this.axeRunStub = null;
    this.testNode.remove();
  }
});

test('service calls axe.run with the correct arguments', function(assert) {
  assert.expect(1);

  this.subject().run(this.testNode, this.testOptions, this.testCallback);

  return wait().then(() => {
    assert.ok(this.axeRunStub.withArgs(this.testNode, this.testOptions, this.testCallback).calledOnce, 'called once with all arguments');
  });
});

test('all concurrent axe.run calls are executed', function(assert) {
  assert.expect(5);

  const service = this.subject();

  for (let i=0; i<3; i++) {
    service.run(this.testNode, this.testOptions, this.testCallback);
  }

  assert.equal(service._queue.length, 2, 'subsequent calls are placed in the queue');
  assert.ok(service._timer, 'subsequent calls are scheduled for the next run loop');

  return wait().then(() => {
    assert.ok(this.axeRunStub.calledThrice, 'axe.run is called thrice');
    assert.equal(service._queue.length, 0, 'queue is cleared');
    assert.notOk(service._timer, 'timer is cleared');
  });
});

test('axe does not audit invalid DOM node', function(assert) {
  assert.expect(1);

  const service = this.subject();
  const div = document.createElement('div');

  service.run(undefined, this.testOptions, this.testCallback);
  service.run({}, this.testOptions, this.testCallback);
  service.run(div, this.testOptions, this.testCallback);

  this.testNode.remove();
  service.run(this.testNode, this.testOptions, this.testCallback);

  return wait().then(() => {
    assert.ok(this.axeRunStub.notCalled, 'axe.run is not called');
  });
});