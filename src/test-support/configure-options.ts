import { getContext } from '@ember/test-helpers';
import { registerDestructor } from '@ember/destroyable';

import type { Spec } from 'axe-core';

let configureOptions: Spec | undefined;

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
export function setConfigureOptions(spec?: Spec) {
  configureOptions = spec;

  const context = getContext();

  if (context) {
    registerDestructor((context as { owner: object }).owner, () => {
      configureOptions = undefined;
    });
  }
}

/**
 * Gets the current axe-core configuration options.
 */
export function getConfigureOptions(): Spec | undefined {
  return configureOptions;
}
