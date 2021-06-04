import { ENABLE_A11Y_MIDDLEWARE_REPORTER } from './cli-options';

export function shouldUseMiddlewareReporter() {
  const url = new URL(window.location.href, document.baseURI);

  return (
    ENABLE_A11Y_MIDDLEWARE_REPORTER ||
    url.searchParams.get('enableA11yMiddlewareReporter') !== null
  );
}
