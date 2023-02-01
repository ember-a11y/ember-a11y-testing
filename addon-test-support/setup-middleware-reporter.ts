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
import { setEnableA11yAudit } from './should-force-audit';

export interface TestMetadata {
  testName?: string;
  setupTypes: string[];
  usedHelpers: string[];
  [key: string]: any;

  readonly isRendering: boolean;
  readonly isApplication: boolean;
}

interface AxeTestResult {
  moduleName: string;
  testName: string;
  testMetaData: TestMetadata;
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

/**
 * Utility to retrieve the route name corresponding to the current test. Absorbs the emitted
 * assertion error if route name is `null`, resulting in an empty string return value.
 *
 * @param getFn Function to use to derive the route name.
 * @returns Route name or empty string.
 */
export function _getCurrentRouteName(getFn = currentRouteName): string {
  let routeName = '';

  try {
    routeName = getFn();
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      !/currentRouteName (\w|\s)+ string/.test(error.message)
    ) {
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
export async function middlewareReporter(axeResults: AxeResults) {
  if (axeResults.violations.length === 0) {
    return;
  }

  if (!currentTestResult) {
    let { module, testName } = QUnit.config.current;
    let testMetaData = getTestMetadata(getContext());

    let stack = (!DEBUG && new Error().stack) || '';

    currentTestResult = {
      moduleName: module.name,
      testName,
      testMetaData,
      urls: [],
      routes: [],
      helpers: [],
      stack,
      violations: [],
    };

    currentViolationsMap = new Map();
    currentUrls = new Set();
    currentRouteNames = new Set();
  }

  currentUrls!.add(currentURL());
  currentRouteNames!.add(_getCurrentRouteName());

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
export function setupMiddlewareReporter() {
  setCustomReporter(middlewareReporter);

  setEnableA11yAudit(true);

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
