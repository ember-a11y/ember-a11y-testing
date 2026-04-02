import { currentRouteName } from '@ember/test-helpers';
import type { AxeResults, Result } from 'axe-core';
export interface TestMetadata {
    testName?: string;
    setupTypes: string[];
    usedHelpers: string[];
    [key: string]: unknown;
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
export declare const TEST_SUITE_RESULTS: AxeTestResult[];
/**
 * Utility to retrieve the route name corresponding to the current test. Absorbs the emitted
 * assertion error if route name is `null`, resulting in an empty string return value.
 *
 * @param getFn Function to use to derive the route name.
 * @returns Route name or empty string.
 */
export declare function _getCurrentRouteName(getFn?: typeof currentRouteName): string;
/**
 * A custom reporter that is invoked once per failed a11yAudit call. This can be called
 * multiple times per test, and the results are accumulated until testDone.
 *
 * @param axeResults The axe results for each a11yAudit.
 * @returns Early returns if no violations are found.
 */
export declare function middlewareReporter(axeResults: AxeResults): void;
/**
 * Invoked once per test. Accumulates the results into a set of results used for
 * reporting via the middleware reporter.
 */
export declare function pushTestResult(): void;
type TestemCallback = (config: unknown, data: unknown, callback: () => void) => void;
declare global {
    interface Window {
        Testem?: {
            afterTests: (callback: TestemCallback) => void;
        };
    }
}
/**
 * Sets up the middleware reporter, which reports results when the test suite is done.
 */
export declare function setupMiddlewareReporter(): void;
export {};
//# sourceMappingURL=setup-middleware-reporter.d.ts.map