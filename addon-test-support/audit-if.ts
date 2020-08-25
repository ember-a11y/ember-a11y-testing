import { resolve } from 'rsvp';
import a11yAudit from './audit';
import { ElementContext, RunOptions } from 'axe-core';
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
  if (shouldForceAudit()) {
    return a11yAudit(contextSelector, axeOptions);
  }

  return resolve(undefined, 'a11y audit not run');
}
