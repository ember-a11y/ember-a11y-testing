import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import sinon from 'sinon';

const { Test, run } = Ember;

const SELECTORS = {
  passingComponent: '[data-test-selector="violations-page__passing-component"]'
};

module('Acceptance | auto-run', {
  beforeEach() {
    this.application = startApp();
    this.sandbox = sinon.sandbox.create();
  },

  afterEach() {
    this.sandbox.restore();
    run(this.application, 'destroy');
  }
});

test('should run the function when visiting a new route and properly report errors', function(assert) {
  const callbackSpy = this.sandbox.spy(run.backburner.options.render, 'after');
  const exceptionStub = this.sandbox.stub(Test.adapter, 'exception');

  visit('/');

  andThen(() => {
    assert.ok(callbackSpy.calledOnce);

    assert.ok(exceptionStub.calledOnce);
    assert.ok(exceptionStub.calledWithMatch(Error));

    assert.equal(currentPath(), 'violations');
  });
});

test('should run the function whenever a render occurs', function(assert) {
  const callbackStub = this.sandbox.stub(run.backburner.options.render, 'after');
  let callCount = 0;

  visit('/');

  andThen(() => {
    callCount = callbackStub.callCount;
    assert.ok(callCount > 0, 'afterRender called at least once for initial visit');
    assert.equal(currentPath(), 'violations');
  });

  click(SELECTORS.passingComponent);

  andThen(() => {
    assert.ok(callbackStub.callCount > callCount, 'afterRender called more than before');
  });
});
