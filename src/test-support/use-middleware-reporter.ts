/**
 * In v1, this was set to `true` at build time by `CliOptionsFilter` when
 * the `ENABLE_A11Y_MIDDLEWARE_REPORTER` environment variable was set. In v2 addons,
 * there is no build-time rewriting. Use the `?enableA11yMiddlewareReporter` query param instead.
 */
const ENABLE_A11Y_MIDDLEWARE_REPORTER = false;

/**
 * Utility to determine whether to use the middleware reporter. This functionality is
 * enabled by the presence of the `enableA11yMiddlewareReporter` query parameter passed
 * to the test suite or the `ENABLE_A11Y_MIDDLEWARE_REPORTER` environmental variable.
 */
export function useMiddlewareReporter() {
  const url = new URL(window.location.href, document.baseURI);

  return (
    ENABLE_A11Y_MIDDLEWARE_REPORTER ||
    url.searchParams.get('enableA11yMiddlewareReporter') !== null
  );
}
