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
  urls: string[];
  routes: string[];
  helpers: string[];
  stack: string;
  violations: Result[];
}

export const TEST_SUITE_RESULTS: AxeTestResult[] = [];

let currentTestResult: AxeTestResult | undefined = undefined;
let currentViolationsMap = new Map<string, Result>();

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
      urls: new Set(),
      routes: new Set(),
      helpers: testMetaData.usedHelpers,
      stack,
      violations: [],
    };
  }

  currentTestResult.urls.add(currentURL());
  currentTestResult.routes.add(currentRouteName());

  axeResults.violations.forEach((violation) => {
    let rule = currentViolationsMap.get(violation.id);

    if (rule === undefined) {
      currentViolationsMap.set(violation.id, violation);
    } else {
      rule.nodes.push(...violation.nodes);
    }
  });
}

export function pushTestResult() {
  if (typeof currentTestResult !== 'undefined') {
    currentTestResult.violations = [...currentViolationsMap.values()];
    currentTestResults.urls = [...currentTestResults.urls.values()]);
    currentTestResults.routes = [...currentTestResults.routes.values()]);
    TEST_SUITE_RESULTS.push(currentTestResult);

    currentTestResult = undefined;
    currentViolationsMap = new Map();
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
