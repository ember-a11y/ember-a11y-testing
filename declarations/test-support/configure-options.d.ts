import type { Spec } from 'axe-core';
/**
 * Sets axe-core configuration options (passed to `axe.configure()`).
 *
 * Unlike `setRunOptions` (which controls *what* axe checks), `setConfigureOptions`
 * controls *how* axe is set up — custom rules, checks, branding, locale, etc.
 *
 * See: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
 *
 * @param spec Axe {Spec} to be passed to `axe.configure()` before each audit.
 */
export declare function setConfigureOptions(spec?: Spec): void;
/**
 * Gets the current axe-core configuration options.
 */
export declare function getConfigureOptions(): Spec | undefined;
//# sourceMappingURL=configure-options.d.ts.map