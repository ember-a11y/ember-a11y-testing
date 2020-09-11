export function setEnableA11yAudit(enabled: boolean = false) {
  const url = new URL(window.location.href, document.baseURI);

  // set up the enableA11yAudit query param
  if (enabled) {
    url.searchParams.set('enableA11yAudit', '');
  } else {
    url.searchParams.delete('enableA11yAudit');
  }

  // updates the URL without reloading
  window.history.replaceState(null, '', url.href);
}

/**
 * Evaluates whether or not to run the audit. This functionality is enabled by
 * the presence of an `enableA11yAudit` query parameter passed to the test suite.
 */
export function shouldForceAudit() {
  const url = new URL(window.location.href, document.baseURI);

  return url.searchParams.get('enableA11yAudit') !== null;
}
