import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

const { Component } = Ember;

// We use a component integration test to verify the behavior of the a11y-audit
// by rendering a component and then running the audit on it.
moduleForComponent('component:axe-component', 'Integration | Helper | a11y-audit', {
  integration: true,

  beforeEach() {
    this.register('component:axe-component', Component.extend());
  }
});

test('a11yAudit runs successfully', function(assert) {
  this.render(hbs`{{#axe-component}}{{/axe-component}}`);

  return a11yAudit(this.$()).then(() => {
    assert.ok(true, 'a11yAudit ran and didn\'t find any issues');
  });
});

test('a11yAudit catches violations successfully', function(assert) {
  this.render(hbs`{{#axe-component}}<button></button>{{/axe-component}}`);

  return a11yAudit(this.$()).catch((e) => {
    assert.strictEqual(e.message, 'Assertion Failed: The page should have no accessibility violations. Please check the developer console for more details.');
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
