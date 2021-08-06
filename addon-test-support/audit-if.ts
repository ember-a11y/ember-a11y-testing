import { ElementContext, RunOptions } from 'axe-core';
import { resolve } from 'rsvp';
import { deprecate } from '@ember/debug';
import a11yAudit from './audit';
import { shouldForceAudit } from './should-force-audit';

/**
 * A wrapper method to run the a11yAudit conditionally
 *
 * @function a11yAuditIf
 * @deprecated
 * @public
 * @param contextSelector A DOM node specifying the context to run the audit in. Defaults to '#ember-testing-container' if not specified.
 * @param axeOptions options to provide to the axe audit. Defaults axe-core defaults.
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
      for: 'ember-a11y-testing',
      since: {
        enabled: '4.0.0',
      },
    }
  );

  if (shouldForceAudit()) {
    return a11yAudit(contextSelector, axeOptions);
  }

  return resolve(undefined, 'a11y audit not run');
}
