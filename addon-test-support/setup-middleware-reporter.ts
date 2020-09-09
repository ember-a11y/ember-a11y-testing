import QUnit from 'qunit';
import { getContext, getTestMetadata } from '@ember/test-helpers';
import { AxeResults } from 'axe-core';
import { setCustomReporter } from './reporter';
import { DEBUG } from '@glimmer/env';

interface AxeTestResult {
  moduleName: string;
  testName: string;
  helperName: string;
  stack: string;
  axeResults: AxeResults;
}

export const TEST_SUITE_RESULTS: AxeTestResult[] = [];

export function buildResult(axeResults: AxeResults) {
  let { module, testName } = QUnit.config.current;
  let testMetaData = getTestMetadata(getContext());

  let stack = (!DEBUG && new Error().stack) || '';

  return {
    moduleName: module.name,
    testName,
    helperName: testMetaData.usedHelpers.pop() || '',
    stack,
    axeResults,
  };
}

export async function middlewareReporter(axeResults: AxeResults) {
  TEST_SUITE_RESULTS.push(buildResult(axeResults));
}

export function setupMiddlewareReporter() {
  setCustomReporter(middlewareReporter);

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
