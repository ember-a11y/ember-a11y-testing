import { ENABLE_A11Y_AUDIT } from './cli-options';

export function calculateUpdatedHref(
  href: string,
  baseURI: string,
  enabled: boolean = false
): string {
  const url = new URL(href, baseURI);

  // set up the enableA11yAudit query param
  if (enabled) {
    url.searchParams.set('enableA11yAudit', '');
  } else {
    url.searchParams.delete('enableA11yAudit');
  }

  return url.href.replace(/=(?=&)|=$/g, '');
}

export function setEnableA11yAudit(enabled: boolean = false) {
  const href = calculateUpdatedHref(
    window.location.href,
    document.baseURI,
    enabled
  );

  // updates the URL without reloading
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
export function shouldForceAudit() {
  const url = new URL(window.location.href, document.baseURI);

  return ENABLE_A11Y_AUDIT || url.searchParams.get('enableA11yAudit') !== null;
}
