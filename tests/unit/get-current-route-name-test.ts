import { module, test } from 'qunit';
import { setupTest } from '#tests/helpers';
import { _getCurrentRouteName } from '#src/test-support/setup-middleware-reporter';

module('Unit | Utils | _getCurrentRouteName', function (hooks) {
  setupTest(hooks);

  test('gets the route name for the current test', function (assert) {
    function mockCurrentRouteName(): string {
      return 'index';
    }

    const result = _getCurrentRouteName(mockCurrentRouteName);

    assert.strictEqual(result, 'index');
  });

  test('absorbs `currentRouteName` error when route name is null', function (assert) {
    function currentRouteNameMock(): string {
      throw new Error('currentRouteName shoudl be a string');
    }

    const result = _getCurrentRouteName(currentRouteNameMock);

    assert.strictEqual(result, '');
  });

  test('bubbles up all other emitted errors', function (assert) {
    function mockCurrentRouteName(): string {
      throw new Error('Catastrophic error!');
    }

    assert.throws(() => {
      _getCurrentRouteName(mockCurrentRouteName);
    }, /Catastrophic error!/);
  });
});
