import Component from '@ember/component';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import utils from 'ember-a11y-testing/test-support/utils';
import a11yAuditIf from 'ember-a11y-testing/test-support/audit-if';

// We use a component integration test to verify the behavior of the a11y-audit
// by rendering a component and then running the audit on it.
moduleForComponent('component:axe-component', 'Integration | Helper | a11y-audit', {
  integration: true,

  beforeEach() {
    this.register('component:axe-component', Component.extend());
  }
});

test('a11yAuditIf should not execute a11yAudit', function(assert) {
  this.render(hbs`{{#axe-component}}<button></button>{{/axe-component}}`);

  return a11yAuditIf(this.$()).then(() => {
    assert.ok(true, 'a11yAuditIf should not run a11yAudit');
  });
});

test('a11yAudit should execute a11yAudit if enableA11yAudit=ture is passed as query param', function(assert) {
  this.render(hbs`{{#axe-component}}<button></button>{{/axe-component}}`);
  utils.getLocation = function() {
    return {
      search: '?enableA11yAudit=true'
    }
  }
  return a11yAuditIf(this.$()).catch((e) => {
    assert.ok(e.message.startsWith('Assertion Failed: The page should have no accessibility violations.'));
  });
});
