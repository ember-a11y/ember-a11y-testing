import { getContext } from '@ember/test-helpers';
import { registerDestructor } from '@ember/destroyable';

const optionsStack = [];

/**
 * Sets run options specific to a test.
 *
 * @param options Axe {RunOptions} to be provided to the audit helper.
 */
function setRunOptions(options = {}) {
  optionsStack.push(options);
  const context = getContext();
  if (context) {
    registerDestructor(context.owner, () => optionsStack.pop());
  }
}

/**
 * Gets run options specific to a test.
 *
 * @param context Test context object, accessed using `@ember/test-helpers` `getContext` function.
 */
function getRunOptions() {
  return optionsStack[optionsStack.length - 1];
}

export { getRunOptions, setRunOptions };
//# sourceMappingURL=run-options.js.map
