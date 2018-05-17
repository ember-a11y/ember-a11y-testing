/**
 * Formats the axe violation for human consumption
 * 
 * @param {AxeViolation} violation
 * @param {String} markup (optional) string of HTML relevant to the violation
 */
export default function formatViolation(violation, markup) {
  if (!violation) {
    throw new Error('formatViolation called without required parameter: violation');
  }
  if (!violation.impact || !violation.help || !violation.helpUrl) {
    throw new Error('formatViolation called with improper structure of parameter: violation. Required properties: impact, help, helpUrl.');
  }

  if (markup) {
    markup = `Offending markup is: \n ${markup}\n`;
  } else {
    markup = '';
  }

  return `[${violation.impact}]: ${violation.help} \n${markup}${violation.helpUrl}`;
}
