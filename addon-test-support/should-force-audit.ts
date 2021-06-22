import { ENABLE_A11Y_AUDIT as ENABLE_A11Y_AUDIT_ENV } from './cli-options';

const ENABLE_A11Y_AUDIT = 'enableA11yAudit';

export function calculateUpdatedHref(
  href: string,
  baseURI: string,
  enabled: boolean = false
): string {
  const url = new URL(href, baseURI);

  // Find all query params with no '='
  let keyOnlyParams = url.href.match(/[?&][^=&]+(?=&|$)/g) || [];

  // Remove leading '?' and '&'
  keyOnlyParams = keyOnlyParams.map((param) => param.slice(1));

  // Include `enableA11yAudit` for normalization
  if (enabled && !keyOnlyParams.includes(ENABLE_A11Y_AUDIT)) {
    keyOnlyParams.push(ENABLE_A11Y_AUDIT);
  }

  // Construct regexp pattern of params to normalize
  const normalizePattern = keyOnlyParams.map((param) => `${param}=`).join('|');
  const normalizeRegExp = new RegExp(normalizePattern, 'g');

  // Set up the `enableA11yAudit` query param
  if (enabled) {
    url.searchParams.set(ENABLE_A11Y_AUDIT, '');
  } else {
    url.searchParams.delete(ENABLE_A11Y_AUDIT);
  }

  return url.href.replace(normalizeRegExp, (param) => param.replace('=', ''));
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
