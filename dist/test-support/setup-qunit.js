import 'qunit';

function setupQUnitA11yAuditToggle(qunit) {
  qunit.config.urlConfig.push({
    id: 'enableA11yAudit',
    label: 'A11y audit',
    tooltip: 'Enable accessibility audit.'
  });
}

export { setupQUnitA11yAuditToggle };
//# sourceMappingURL=setup-qunit.js.map
