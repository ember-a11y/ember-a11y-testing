import { ElementContext, RunOptions } from 'axe-core';
import { resolve } from 'rsvp';
import { deprecate } from '@ember/debug';
import a11yAudit from './audit';
import { shouldForceAudit } from './should-force-audit';

/**
 * A wrapper method to run the a11yAudit if desired
 *
 * @method a11yAuditIf
 * @public
 */
export default function a11yAuditIf(
  contextSelector?: ElementContext | RunOptions | undefined,
  axeOptions?: RunOptions | undefined
): PromiseLike<void> {
  deprecate(
    "ember-a11y-testing's `a11yAuditIf` is deprecated. Please use a11yAudit when using the `enableA11yAudit` query param",
    false,
    {
      id: 'ember-a11y-testing-deprecated-a11y-audit-if',
      until: '5.0.0',
    }
  );

  if (shouldForceAudit()) {
    return a11yAudit(contextSelector, axeOptions);
  }

  return resolve(undefined, 'a11y audit not run');
}
