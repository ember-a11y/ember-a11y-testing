import QUnit from 'qunit';
import {
  currentRouteName,
  currentURL,
  getContext,
  getTestMetadata,
} from '@ember/test-helpers';
import { AxeResults, Result } from 'axe-core';
import { setCustomReporter } from './reporter';
import { DEBUG } from '@glimmer/env';

interface AxeTestResult {
  moduleName: string;
  testName: string;
  urls: string[] | Set<string>;
  routes: string[] | Set<string>;
  helpers: string[];
  stack: string;
  violations: Result[];
}

export const TEST_SUITE_RESULTS: AxeTestResult[] = [];

let currentTestResult: AxeTestResult | undefined = undefined;
let currentViolationsMap: Map<string, Result> | undefined = undefined;
let currentUrls: Set<string> | undefined;
let currentRouteNames: Set<string> | undefined;
let currentTestHelpers: Set<string> | undefined;

/**
 * A custom reporter that is invoked once per failed a11yAudit call. This can be called
 * multiple times per test, and the results are accumulated until testDone.
 *
 * @param axeResults The axe results for each a11yAudit.
 * @returns Early returns if no violations are found.
 */
export async function middlewareReporter(axeResults: AxeResults) {
  if (axeResults.violations.length === 0) {
    return;
  }

  let testMetaData = getTestMetadata(getContext());

  if (!currentTestResult) {
    let { module, testName } = QUnit.config.current;

    let stack = (!DEBUG && new Error().stack) || '';

    currentTestResult = {
      moduleName: module.name,
      testName,
      urls: [],
      routes: [],
      helpers: [],
      stack,
      violations: [],
    };

    currentViolationsMap = new Map();
    currentUrls = new Set();
    currentRouteNames = new Set();
    currentTestHelpers = new Set();
  }

  currentTestHelpers = new Set([
    ...currentTestHelpers!.values(),
    ...testMetaData.usedHelpers,
  ]);
  currentUrls!.add(currentURL());
  currentRouteNames!.add(currentRouteName());

  axeResults.violations.forEach((violation) => {
    let rule = currentViolationsMap!.get(violation.id);

    if (rule === undefined) {
      currentViolationsMap!.set(violation.id, violation);
    } else {
      rule.nodes.push(...violation.nodes);
    }
  });
}

/**
 * Invoked once per test. Accumulates the results into a set of results used for
 * reporting via the middleware reporter.
 */
export function pushTestResult() {
  if (typeof currentTestResult !== 'undefined') {
    currentTestResult.violations = [...currentViolationsMap!.values()];
    currentTestResult.urls = [...currentUrls!.values()];
    currentTestResult.routes = [...currentRouteNames!.values()];
    currentTestResult.helpers = [...currentTestHelpers!.values()];

    TEST_SUITE_RESULTS.push(currentTestResult);

    currentTestResult = undefined;
    currentViolationsMap = undefined;
    currentUrls = undefined;
    currentRouteNames = undefined;
    currentTestHelpers = undefined;
  }
}

/**
 * Sets up the middleware reporter, which reports results when the test suite is done.
 */
export function setupMiddlewareReporter() {
  setCustomReporter(middlewareReporter);

  QUnit.testDone(pushTestResult);

  QUnit.done(async function () {
    let response = await fetch('/report-violations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_SUITE_RESULTS),
    });

    return response.json();
  });
}
