import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import type { TestContext } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { a11yAudit, setEnableA11yAudit } from 'ember-a11y-testing/test-support';

interface Context extends TestContext {
  element: Element;
}

module('Integration | Helper | a11yAudit', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    setEnableA11yAudit(true);
  });

  hooks.afterEach(function () {
    setEnableA11yAudit(false);
  });

  test('a11yAudit runs successfully with element context', async function (this: Context, assert) {
    await render(hbs`<div></div>`);
    await a11yAudit(this.element);
    assert.ok(true, "a11yAudit ran and didn't find any issues");
  });

  test('a11yAudit catches violations successfully', async function (this: Context, assert) {
    await render(hbs`<div><button type="button"></button></div>`);

    await assert.rejects(
      <Promise<any>>a11yAudit(this.element),
      /The page should have no accessibility violations. Violations:/,
      'error message is correct'
    );
  });

  test('a11yAudit can use custom axe options', async function (this: Context, assert) {
    await render(hbs`<div><button type="button"></button></div>`);

    await a11yAudit(this.element, {
      rules: {
        'button-name': {
          enabled: false,
        },
      },
    });

    assert.ok(true, 'a11yAudit ran and used the custom options');
  });

  test('a11yAudit can use custom axe options as single argument', async function (assert) {
    await render(hbs`<div><button type="button"></button></div>`);

    await a11yAudit({
      rules: {
        'button-name': {
          enabled: false,
        },
      },
    });

    assert.ok(true, 'a11yAudit ran and used the custom options');
  });
});
