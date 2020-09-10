import QUnit from 'qunit';
import { printResults } from './logger';

export function setupConsoleLogger() {
  QUnit.done(function () {
    printResults();
  });
}
