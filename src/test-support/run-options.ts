import { getContext } from '@ember/test-helpers';
import { registerDestructor } from '@ember/destroyable';

import type { RunOptions } from 'axe-core';

const optionsStack: RunOptions[] = [];

/**
 * Sets run options specific to a test.
 *
 * @param options Axe {RunOptions} to be provided to the audit helper.
 */
export function setRunOptions(options: RunOptions = {}) {
  optionsStack.push(options);

  const context = getContext();

  if (context) {
    registerDestructor((context as { owner: object }).owner, () =>
      optionsStack.pop(),
    );
  }
}

/**
 * Gets run options specific to a test.
 *
 * @param context Test context object, accessed using `@ember/test-helpers` `getContext` function.
 */
export function getRunOptions() {
  return optionsStack[optionsStack.length - 1];
}
