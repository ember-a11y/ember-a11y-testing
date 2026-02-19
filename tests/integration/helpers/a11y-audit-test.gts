import { module, test } from 'qunit';
import { setupRenderingTest } from '#tests/helpers';
import { render } from '@ember/test-helpers';
import {
  a11yAudit,
  setEnableA11yAudit,
  setConfigureOptions,
} from '#src/test-support';

import type { TestContext } from '@ember/test-helpers';
import type { TOC } from '@ember/component/template-only';

const AxeComponent = <template>
  <div>{{yield}}</div>
</template> satisfies TOC<{
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}>;

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
    await render(<template><AxeComponent /></template>);
    await a11yAudit(this.element);
    assert.ok(true, "a11yAudit ran and didn't find any issues");
  });

  test('a11yAudit catches violations successfully', async function (this: Context, assert) {
    await render(
      <template>
        <AxeComponent><button type="button"></button></AxeComponent>
      </template>,
    );

    await assert.rejects(
      a11yAudit(this.element) as Promise<void>,
      /The page should have no accessibility violations. Violations:/,
      'error message is correct',
    );
  });

  test('a11yAudit can use custom axe options', async function (this: Context, assert) {
    await render(
      <template>
        <AxeComponent><button type="button"></button></AxeComponent>
      </template>,
    );

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
    await render(
      <template>
        <AxeComponent><button type="button"></button></AxeComponent>
      </template>,
    );

    await a11yAudit({
      rules: {
        'button-name': {
          enabled: false,
        },
      },
    });

    assert.ok(true, 'a11yAudit ran and used the custom options');
  });

  test('a11yAudit applies axe.configure options via setConfigureOptions', async function (this: Context, assert) {
    await render(
      <template>
        <AxeComponent><button type="button"></button></AxeComponent>
      </template>,
    );

    // Disable the button-name rule via axe.configure (Spec format)
    setConfigureOptions({
      rules: [
        {
          id: 'button-name',
          enabled: false,
        },
      ],
    });

    await a11yAudit(this.element);

    assert.ok(
      true,
      'a11yAudit ran with configure options that disabled the button-name rule',
    );
  });

  test('setConfigureOptions is reset after test teardown', async function (this: Context, assert) {
    // Configure options set in the previous test should not persist
    await render(
      <template>
        <AxeComponent><button type="button"></button></AxeComponent>
      </template>,
    );

    // Without setConfigureOptions, the button-name violation should be detected
    await assert.rejects(
      a11yAudit(this.element) as Promise<void>,
      /The page should have no accessibility violations/,
      'configure options from previous test did not leak',
    );
  });
});
