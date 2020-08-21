/**
 * Formats the axe violation for human consumption
 *
 * @param {AxeViolation} violation
 * @param {String} markup (optional) string of HTML relevant to the violation
 */
export default function formatViolation(violation, markup) {
  if (!violation) {
    throw new Error(
      'formatViolation called without required parameter: violation'
    );
  }
  if (!violation.impact || !violation.help || !violation.helpUrl) {
    throw new Error(
      'formatViolation called with improper structure of parameter: violation. Required properties: impact, help, helpUrl.'
    );
  }

  let count = 1;

  if (markup) {
    if (Array.isArray(markup)) {
      count = markup.length;
      markup = markup.join('\n');
    }
    markup = ` Offending nodes are: \n${markup}`;
  } else {
    markup = '';
  }

  let plural = count === 1 ? '' : 's';
  let violationCount = `Violated ${count} time${plural}.`;

  return `[${violation.impact}]: ${violation.help} \n${violationCount}${markup}\n${violation.helpUrl}`;
}
