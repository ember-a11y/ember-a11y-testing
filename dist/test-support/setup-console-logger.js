import QUnit from 'qunit';
import { printResults } from './logger.js';

/**
 * Sets up the console logger to print axe results to the console when the test suite is done.
 */
function setupConsoleLogger() {
  QUnit.done(function () {
    printResults();
  });
}

export { setupConsoleLogger };
//# sourceMappingURL=setup-console-logger.js.map
