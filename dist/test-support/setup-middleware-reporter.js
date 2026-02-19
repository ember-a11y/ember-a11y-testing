import QUnit from 'qunit';
import { currentRouteName, getContext, getTestMetadata, currentURL } from '@ember/test-helpers';
import { macroCondition, isDevelopingApp } from '@embroider/macros';
import { setCustomReporter } from './reporter.js';
import { setEnableA11yAudit } from './should-force-audit.js';

const TEST_SUITE_RESULTS = [];
let currentTestResult = undefined;
let currentViolationsMap = undefined;
let currentUrls;
let currentRouteNames;

/**
 * Utility to retrieve the route name corresponding to the current test. Absorbs the emitted
 * assertion error if route name is `null`, resulting in an empty string return value.
 *
 * @param getFn Function to use to derive the route name.
 * @returns Route name or empty string.
 */
function _getCurrentRouteName(getFn = currentRouteName) {
  let routeName = '';
  try {
    routeName = getFn();
  } catch (error) {
    if (error instanceof Error && !/currentRouteName (\w|\s)+ string/.test(error.message)) {
      throw error;
    }
  }
  return routeName;
}

/**
 * A custom reporter that is invoked once per failed a11yAudit call. This can be called
 * multiple times per test, and the results are accumulated until testDone.
 *
 * @param axeResults The axe results for each a11yAudit.
 * @returns Early returns if no violations are found.
 */
function middlewareReporter(axeResults) {
  if (axeResults.violations.length === 0) {
    return;
  }
  const context = getContext();
  if (!currentTestResult) {
    const {
      module,
      testName
    } = QUnit.config.current;
    if (!context) {
      throw new Error('You tried to run ember-a11y-testing without calling one of the `setupTest` helpers from `@ember/test-helpers`. Please make sure your test setup calls `setupTest()`, `setupRenderingTest()`, or `setupApplicationTest()`!');
    }
    const testMetaData = getTestMetadata(context);
    const stack = macroCondition(isDevelopingApp()) ? '' : new Error().stack || '';
    currentTestResult = {
      moduleName: module.name,
      testName,
      testMetaData,
      urls: [],
      routes: [],
      helpers: [],
      stack,
      violations: []
    };
    currentViolationsMap = new Map();
    currentUrls = new Set();
    currentRouteNames = new Set();
  }
  if (context) {
    currentUrls.add(currentURL());
    currentRouteNames.add(_getCurrentRouteName());
  }
  axeResults.violations.forEach(violation => {
    const rule = currentViolationsMap.get(violation.id);
    if (rule === undefined) {
      currentViolationsMap.set(violation.id, violation);
    } else {
      rule.nodes.push(...violation.nodes);
    }
  });
}

/**
 * Invoked once per test. Accumulates the results into a set of results used for
 * reporting via the middleware reporter.
 */
function pushTestResult() {
  if (typeof currentTestResult !== 'undefined') {
    currentTestResult.violations = [...currentViolationsMap.values()];
    currentTestResult.urls = [...currentUrls.values()];
    currentTestResult.routes = [...currentRouteNames.values()];
    currentTestResult.helpers = currentTestResult.testMetaData.usedHelpers;
    TEST_SUITE_RESULTS.push(currentTestResult);
    currentTestResult = undefined;
    currentViolationsMap = undefined;
    currentUrls = undefined;
    currentRouteNames = undefined;
  }
}
/**
 * Sets up the middleware reporter, which reports results when the test suite is done.
 */
function setupMiddlewareReporter() {
  setCustomReporter(middlewareReporter);
  setEnableA11yAudit(true);
  QUnit.testDone(pushTestResult);
  if (window.Testem) {
    window.Testem.afterTests(function (_config, _data, callback) {
      void sendViolationsToServer().finally(callback);
    });
  } else {
    QUnit.done(async function () {
      await sendViolationsToServer();
    });
  }
}
async function sendViolationsToServer() {
  const response = await fetch('/report-violations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(TEST_SUITE_RESULTS)
  });
  await response.json();
}

export { TEST_SUITE_RESULTS, _getCurrentRouteName, middlewareReporter, pushTestResult, setupMiddlewareReporter };
//# sourceMappingURL=setup-middleware-reporter.js.map
