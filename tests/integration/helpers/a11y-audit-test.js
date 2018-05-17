import Component from '@ember/component';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

// We use a component integration test to verify the behavior of the a11y-audit
// by rendering a component and then running the audit on it.
moduleForComponent('component:axe-component', 'Integration | Helper | a11y-audit', {
  integration: true,

  beforeEach() {
    this.register('component:axe-component', Component.extend());
  }
});

test('a11yAudit runs successfully with jquery context', function(assert) {
  this.render(hbs`{{#axe-component}}{{/axe-component}}`);

  return a11yAudit(this.$()).then(() => {
    assert.ok(true, 'a11yAudit ran and didn\'t find any issues');
  });
});

test('a11yAudit runs successfully with element context', function(assert) {
  this.render(hbs`{{#axe-component}}{{/axe-component}}`);

  return a11yAudit(this.$()[0]).then(() => {
    assert.ok(true, 'a11yAudit ran and didn\'t find any issues');
  });
});

test('a11yAudit catches violations successfully', function(assert) {
  this.render(hbs`{{#axe-component}}<button></button>{{/axe-component}}`);

  return a11yAudit(this.$()).catch((e) => {
    assert.ok(e.message.startsWith('Assertion Failed: The page should have no accessibility violations. Violations:', 'error message is correct'));
  });
});

test('a11yAudit can use custom axe options', function(assert) {
  this.render(hbs`{{#axe-component}}<button></button>{{/axe-component}}`);

  return a11yAudit(this.$(), {
    rules: {
      'button-name': {
        enabled: false
      }
    }
  }).then(() => {
    assert.ok(true, 'a11yAudit ran and used the custom options');
  });
});

test('a11yAudit can use custom axe options as single argument', function(assert) {
  this.render(hbs`{{#axe-component}}<button></button>{{/axe-component}}`);

  return a11yAudit( {
    rules: {
      'button-name': {
        enabled: false
      }
    }
  }).then(() => {
    assert.ok(true, 'a11yAudit ran and used the custom options');
  });
});
