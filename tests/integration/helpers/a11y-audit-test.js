import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

module('Integration | Helper | a11yAudit', function(hooks) {
  setupRenderingTest(hooks);

  if (typeof jQuery != 'undefined') {
    test('a11yAudit runs successfully with jquery context', async function(assert) {
      await render(hbs`{{#axe-component}}{{/axe-component}}`);
      await a11yAudit(this.$());
      assert.ok(true, 'a11yAudit ran and didn\'t find any issues');
    });
  }

  test('a11yAudit runs successfully with element context', async function(assert) {
    await render(hbs`{{#axe-component}}{{/axe-component}}`);
    await a11yAudit(this.element);
    assert.ok(true, 'a11yAudit ran and didn\'t find any issues');
  });

  test('a11yAudit catches violations successfully', async function(assert) {
    await render(hbs`{{#axe-component}}<button></button>{{/axe-component}}`);

    try {
      await a11yAudit(this.element);
      assert.ok(false, 'should have failed');
    } catch (error) {
      let found = error.message.startsWith('Assertion Failed: The page should have no accessibility violations. Violations:');
      assert.ok(found, 'error message is correct');
    }
  });

  test('a11yAudit can use custom axe options', async function(assert) {
    await render(hbs`{{#axe-component}}<button></button>{{/axe-component}}`);

    await a11yAudit(this.element, {
      rules: {
        'button-name': {
          enabled: false
        }
      }
    });

    assert.ok(true, 'a11yAudit ran and used the custom options');
  });

  test('a11yAudit can use custom axe options as single argument', async function(assert) {
    await render(hbs`{{#axe-component}}<button></button>{{/axe-component}}`);

    await a11yAudit( {
      rules: {
        'button-name': {
          enabled: false
        }
      }
    });

    assert.ok(true, 'a11yAudit ran and used the custom options');
  });
});
