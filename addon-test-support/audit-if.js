import RSVP from 'rsvp';
import a11yAudit from './audit';
import utils from './utils';

/**
 * A method to return the value of queryParameter
 *
 * @method getUrlParameter
 * @private
 */
function getUrlParameter(name) {
    const location = utils.getLocation();
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/**
 * A wrapper method to run the a11yAudit if desired
 *
 * @method a11yAuditIf
 * @public
 */
export default function a11yAuditIf(...args) {
  if(getUrlParameter('enableA11yAudit') === 'true') {
    return a11yAudit(...args);
  }

  return RSVP.resolve(undefined, 'a11y audit not run');
}
