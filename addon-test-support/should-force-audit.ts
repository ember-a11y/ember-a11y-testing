import { ENABLE_A11Y_AUDIT as ENABLE_A11Y_AUDIT_ENV } from './cli-options';

const ENABLE_A11Y_AUDIT = 'enableA11yAudit';

export function calculateUpdatedHref(
  href: string,
  baseURI: string,
  enabled: boolean = false
): string {
  const url = new URL(href, baseURI);
  const initialHref = url.href;

  // Set up the `enableA11yAudit` query param
  if (enabled) {
    url.searchParams.set(ENABLE_A11Y_AUDIT, '');
  } else {
    url.searchParams.delete(ENABLE_A11Y_AUDIT);
  }

  // Match all key-only params with '='
  return url.href.replace(/([^?&]+)=(?=&|$)/g, (match, sub) => {
    // Only normalize `enableA11yAudit` or params that didn't initially include '='
    if (sub === ENABLE_A11Y_AUDIT || !initialHref.includes(match)) {
      return sub;
    }
    return match;
  });
}

export function setEnableA11yAudit(enabled: boolean = false) {
  const href = calculateUpdatedHref(
    window.location.href,
    document.baseURI,
    enabled
  );

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
export function shouldForceAudit() {
  const url = new URL(window.location.href, document.baseURI);

  return (
    ENABLE_A11Y_AUDIT_ENV || url.searchParams.get('enableA11yAudit') !== null
  );
}
