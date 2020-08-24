import { module, test } from 'qunit';
import {
  _normalizeRunParams,
  _setConfigName,
  _isContext,
} from 'ember-a11y-testing/test-support/audit';

module('audit', function () {
  module('with no config', function (hooks) {
    hooks.beforeEach(function () {
      _setConfigName('foo');
    });

    hooks.afterEach(function () {
      _setConfigName();
    });

    test('_normalizeRunParams returns defaults when no params provided', function (assert) {
      let [context, options] = _normalizeRunParams();

      assert.equal(context, '#ember-testing-container');
      assert.deepEqual(options, {});
    });

    test('_normalizeRunParams returns default options when only string context provided', function (assert) {
      let ctx = '#my-container';
      let [context, options] = _normalizeRunParams(ctx);

      assert.equal(context, '#my-container');
      assert.deepEqual(options, {});
    });

    test('_normalizeRunParams returns default options when only Node context provided', function (assert) {
      let ctx = document;
      let [context, options] = _normalizeRunParams(ctx);

      assert.equal(context, document);
      assert.deepEqual(options, {});
    });

    test('_normalizeRunParams returns default options when only ElementContext provided', function (assert) {
      let ctx = { include: ['me'] };
      let [context, options] = _normalizeRunParams(ctx);

      assert.equal(context, ctx);
      assert.deepEqual(options, {});
    });

    test('_normalizeRunParams returns defaults context when only options provided', function (assert) {
      let opts = {};
      let [context, options] = _normalizeRunParams(opts);

      assert.equal(context, '#ember-testing-container');
      assert.deepEqual(options, opts);
    });

    test('_normalizeRunParams returns context and options when both provided', function (assert) {
      let ctx = '#my-container';
      let opts = {};
      let [context, options] = _normalizeRunParams(ctx, opts);

      assert.equal(context, ctx);
      assert.deepEqual(options, opts);
    });
  });

  module('with config', function () {
    test('_normalizeRunParams returns defaults when no params provided', function (assert) {
      let [context, options] = _normalizeRunParams();

      assert.equal(context, '#ember-testing-container');
      assert.ok(Object.keys(options).length > 0);
    });

    test('_normalizeRunParams returns config options when only string context provided', function (assert) {
      let ctx = '#my-container';
      let [context, options] = _normalizeRunParams(ctx);

      assert.equal(context, '#my-container');
      assert.ok(Object.keys(options).length > 0);
    });
  });

  test('_isContext', function (assert) {
    assert.ok(_isContext('#foo'));
    assert.ok(_isContext(document));
    assert.ok(_isContext({ include: [] }));
    assert.ok(_isContext({ exclude: [] }));
    assert.ok(_isContext({ include: [], exclude: [] }));

    assert.notOk(_isContext(undefined));
    assert.notOk(_isContext({}));
  });
});
