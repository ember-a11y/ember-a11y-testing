import type { RunOptions } from 'axe-core';
import { getContext } from '@ember/test-helpers';
import { registerDestructor } from '@ember/destroyable';

let optionsStack: RunOptions[] = [];

/**
 * Sets run options specific to a test.
 *
 * @param options Axe {RunOptions} to be provided to the audit helper.
 */
export function setRunOptions(options: RunOptions = {}) {
  optionsStack.push(options);

  let context = getContext();
  if (context) {
    registerDestructor((context as any).owner, () => optionsStack.pop());
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
