import * as QUnit from 'qunit';

export function setupQUnitA11yAudit(qunit: QUnit) {
  qunit.config.urlConfig.push({
    id: 'enableA11yAudit',
    label: 'A11y audit',
    tooltip: 'Enable accessibility audit.',
  });
}
