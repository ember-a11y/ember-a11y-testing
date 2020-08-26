import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

const SELECTORS = {
  passingComponent: '[data-test-selector="violations-page__passing-component"]',
  failingComponent: '[data-test-selector="empty-button"]',
};

module('Acceptance | a11y audit', function (hooks) {
  setupApplicationTest(hooks);

  test('a11yAudit should catch violations as an async helper', async function (assert) {
    assert.expect(1);

    await visit('/');

    try {
      await a11yAudit();
      assert.ok(false, 'a11yAudit should have thrown an error on violations');
    } catch (error) {
      let foundExpectedError = error.message.startsWith(
        'The page should have no accessibility violations. Violations:'
      );
      assert.ok(foundExpectedError, 'error message is correct');
    }
  });

  test('a11yAudit should properly scope to a specified string context selector', async function (assert) {
    assert.expect(2);

    await visit('/');

    try {
      await a11yAudit(SELECTORS.passingComponent);
      assert.ok(true, 'a11yAudit should not have discovered any issues');
    } catch (error) {
      assert.ok(false, error.message);
    }

    try {
      await a11yAudit(SELECTORS.failingComponent);
      assert.ok(false, 'a11yAudit should have thrown an error on violations');
    } catch (error) {
      let foundExpectedError = error.message.startsWith(
        'The page should have no accessibility violations. Violations:'
      );
      assert.ok(foundExpectedError, 'error message is correct');
    }
  });

  test('a11yAudit should properly scope to a specified jquery context (not recommended)', async function (assert) {
    await visit('/');

    await a11yAudit(SELECTORS.passingComponent);
    assert.ok(true, 'a11yAudit should not have discovered any issues');
  });

  test('a11yAudit should properly scope to a specified html element context (not recommended)', async function (assert) {
    await visit('/');

    await a11yAudit(SELECTORS.passingComponent);
    assert.ok(true, 'a11yAudit should not have discovered any issues');
  });

  test('a11yAudit accounts for axe.run include and exclude context parameter', async function (assert) {
    await visit('/');

    await a11yAudit({
      include: [[SELECTORS.passingComponent]],
    });

    await a11yAudit({
      include: [['#ember-testing-container']],
      exclude: [
        [SELECTORS.failingComponent],
        ['[data-test-selector="labeless-text-input"]'],
        ['[data-test-selector="paragraph-with-blink-tag"]'],
        ['[data-test-selector="ungrouped-radio-inputs"]'],
        ['[data-test-selector="noise-level-selection"]'],
        ['[data-test-selector="poor-text-contrast"]'],
      ],
    });

    assert.ok(true, 'no errors should have been found in a11yAudit');
  });

  test('a11yAudit can accept an options hash in addition to context', async function (assert) {
    await visit('/');

    await a11yAudit(SELECTORS.failingComponent, {
      rules: {
        'button-name': {
          enabled: false,
        },
      },
    });

    assert.ok(true, 'no errors should have been found in a11yAudit');
  });

  test('a11yAudit can accept an options hash as a single argument', async function (assert) {
    await visit('/');

    await a11yAudit({
      runOnly: {
        type: 'rule',
        values: ['accesskeys'],
      },
    });

    assert.ok(true, 'no errors should have been found in a11yAudit');
  });

  test('a11yAudit loads default config if none specified', async function (assert) {
    await visit('/ignored-image-alt');

    // There is an error with img alt tag, but it's ignored in global config
    await a11yAudit();

    assert.ok(true, 'the image-alt rule should be ignored');
  });
});
