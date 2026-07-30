import type { RunOptions } from 'axe-core';
/**
 * Sets run options specific to a test.
 *
 * @param options Axe {RunOptions} to be provided to the audit helper.
 */
export declare function setRunOptions(options?: RunOptions): void;
/**
 * Gets run options specific to a test.
 *
 * @param context Test context object, accessed using `@ember/test-helpers` `getContext` function.
 */
export declare function getRunOptions(): RunOptions | undefined;
//# sourceMappingURL=run-options.d.ts.map