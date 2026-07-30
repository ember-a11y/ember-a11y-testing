/**
 * In v1, this was set to `true` at build time by `CliOptionsFilter` when
 * the `ENABLE_A11Y_AUDIT` environment variable was set. In v2 addons,
 * there is no build-time rewriting. Use the `?enableA11yAudit` query param
 * or call `setEnableA11yAudit(true)` programmatically instead.
 */
function _calculateUpdatedHref(href, baseURI, enabled = false) {
  const url = new URL(href, baseURI);
  const initialHref = url.href;

  // Set up the `enableA11yAudit` query param
  if (enabled) {
    url.searchParams.set('enableA11yAudit', '');
  } else {
    url.searchParams.delete('enableA11yAudit');
  }

  // Match all key-only params with '='
  return url.href.replace(/([^?&]+)=(?=&|$)/g, (match, sub) => {
    // Only normalize `enableA11yAudit` or params that didn't initially include '='
    return sub === 'enableA11yAudit' || !initialHref.includes(match) ? sub : match;
  });
}
function setEnableA11yAudit(enabled = false) {
  const href = _calculateUpdatedHref(window.location.href, document.baseURI, enabled);

  // Update the URL without reloading
  window.history.replaceState(null, '', href);
}

/**
 * Forces running audits. This functionality is enabled by
 * the presence of an `enableA11yAudit` query parameter passed to the test suite
 * or the `ENABLE_A11Y_AUDIT` environment variable.
 *
 * If used with `setupGlobalA11yHooks` and the query param enabled, this will override
 * any `InvocationStrategy` passed to that function and force the audit.
 */
function shouldForceAudit() {
  const url = new URL(window.location.href, document.baseURI);
  return url.searchParams.get('enableA11yAudit') !== null;
}

export { _calculateUpdatedHref, setEnableA11yAudit, shouldForceAudit };
//# sourceMappingURL=should-force-audit.js.map
