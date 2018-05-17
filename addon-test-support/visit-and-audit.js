import { visit as visitHelper } from '@ember/test-helpers';
import a11yAudit from './audit';

/**
 * A wrapper method to run the a11yAudit if desired
 *
 * @method a11yAuditIf
 * @public
 */
export default function visitAndAudit(path, axeOptions) {
  let visit = window.visit || visitHelper;
  return visit(path).then(() => {
    return a11yAudit(axeOptions);
  });
}
