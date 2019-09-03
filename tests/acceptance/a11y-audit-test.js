import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

const SELECTORS = {
  passingComponent: '[data-test-selector="violations-page__passing-component"]',
  failingComponent: '[data-test-selector="empty-button"]'
};

module('Acceptance | a11y-audit', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    run(this.application, 'destroy');
  }
});

test('a11yAudit should catch violations as an async helper', function(assert) {
  assert.expect(1);

  visit('/');

  // Since we have `catch` blocks, we need to return these promises to ensure
  // QUnit waits the whole time(you shouldn't do this normally).
  return a11yAudit().then(() => {
    assert.ok(false, 'a11yAudit should have thrown an error on violations');
  }).catch((e) => {
    assert.ok(e.message.startsWith('Assertion Failed: The page should have no accessibility violations. Violations:', 'error message is correct'));
  });
});

test('a11yAudit should properly scope to a specified string context selector', function(assert) {
  assert.expect(2);

  visit('/');

  a11yAudit(SELECTORS.passingComponent).then(() => {
    assert.ok(true, 'a11yAudit should not have discovered any issues');
  });

  // Since we have `catch` blocks, we need to return these promises to ensure
  // QUnit waits the whole time(you shouldn't do this normally).
  return a11yAudit(SELECTORS.failingComponent).then(() => {
    assert.ok(false, 'a11yAudit should have thrown an error on violations');
  }).catch((e) => {
    assert.ok(e.message.startsWith('Assertion Failed: The page should have no accessibility violations. Violations:', 'error message is correct'));
  });
});

test('a11yAudit should properly scope to a specified jquery context (not recommended)', function(assert) {
  visit('/');

  andThen(() => {
    return a11yAudit($(SELECTORS.passingComponent)).then(() => {
      assert.ok(true, 'a11yAudit should not have discovered any issues');
    });
  });
});

test('a11yAudit should properly scope to a specified html element context (not recommended)', function(assert) {
  visit('/');

  andThen(() => {
    return a11yAudit(document.querySelector(SELECTORS.passingComponent)).then(() => {
      assert.ok(true, 'a11yAudit should not have discovered any issues');
    });
  });
});

test('a11yAudit accounts for axe.run include and exclude context parameter', function(assert) {
  const exclSelectors = [
    [SELECTORS.failingComponent],
    ['[data-test-selector="labeless-text-input"]'],
    ['[data-test-selector="poor-text-contrast"]'],
    ['[data-test-selector="paragraph-with-blink-tag"]'],
    ['[data-test-selector="ungrouped-radio-inputs"]'],
    ['[data-test-selector="noise-level-selection"]']
  ];

  visit('/');

  a11yAudit({
    include: [[SELECTORS.passingComponent]]
  });

  a11yAudit({
    exclude: exclSelectors
  });

  a11yAudit({
    include: [['#ember-testing-container']],
    exclude: exclSelectors
  });

  andThen(() => {
    assert.ok(true, 'no errors should have been found in a11yAudit');
  });
});

test('a11yAudit can accept an options hash in addition to context', function(assert) {
  visit('/');

  a11yAudit(SELECTORS.failingComponent, {
    rules: {
      'button-name': {
        enabled: false
      }
    }
  });

  andThen(() => {
    assert.ok(true, 'no errors should have been found in a11yAudit');
  });
});

test('a11yAudit can accept an options hash as a single argument', function(assert) {
  visit('/');

  a11yAudit({
    runOnly: {
      type: "rule",
      values: ["accesskeys"]
    }
  });

  andThen(() => {
    assert.ok(true, 'no errors should have been found in a11yAudit');
  });
});

test('a11yAudit loads default config if none specified', function(assert) {
  visit('/ignored-image-alt');

  // There is an error with img alt tag, but it's ignored in global config
  a11yAudit();

  andThen(() => {
    assert.ok(true, 'the image-alt rule should be ignored');
  });
});
