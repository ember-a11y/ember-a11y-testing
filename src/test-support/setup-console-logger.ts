import QUnit from 'qunit';
import { printResults } from './logger.ts';

/**
 * Sets up the console logger to print axe results to the console when the test suite is done.
 */
export function setupConsoleLogger() {
  QUnit.done(function () {
    printResults();
  });
}
