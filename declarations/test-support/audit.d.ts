import '../a11y-audit.css';
import type { RunOptions, ElementContext } from 'axe-core';
type MaybeElementContext = ElementContext | RunOptions | undefined;
/**
 * Validation function used to determine if we have the shape of an {ElementContext} object.
 *
 * Function mirrors what axe-core uses for internal param validation.
 * https://github.com/dequelabs/axe-core/blob/d5b6931cba857a5c787d912ee56bdd973e3742d4/lib/core/public/run.js#L4
 *
 * @param potential
 */
export declare function _isContext(potential: MaybeElementContext): boolean;
/**
 * Normalize the optional params of axe.run()
 *
 * Influenced by https://github.com/dequelabs/axe-core/blob/d5b6931cba857a5c787d912ee56bdd973e3742d4/lib/core/public/run.js#L35
 *
 * @param  elementContext
 * @param  runOptions
 */
export declare function _normalizeRunParams(elementContext?: MaybeElementContext, runOptions?: RunOptions): [ElementContext, RunOptions];
/**
 * Runs the axe a11y audit with the given context selector and options.
 *
 * @function a11yAudit
 * @public
 * @param contextSelector A DOM node specifying the context to run the audit in. Defaults to '#ember-testing-container' if not specified.
 * @param axeOptions options to provide to the axe audit. Defaults axe-core defaults.
 */
export default function a11yAudit(contextSelector?: MaybeElementContext, axeOptions?: RunOptions): PromiseLike<void>;
export {};
//# sourceMappingURL=audit.d.ts.map