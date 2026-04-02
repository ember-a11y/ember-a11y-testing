import type { Result } from 'axe-core';

/**
 * Formats the axe violation for human consumption
 *
 * @param {Partial<Result>} violation
 * @param {string[]} markup (optional) string of HTML relevant to the violation
 */
export default function formatViolation(
  violation: Partial<Result>,
  markup: string[],
) {
  if (!violation.impact || !violation.help || !violation.helpUrl) {
    throw new Error(
      'formatViolation called with improper structure of parameter: violation. Required properties: impact, help, helpUrl.',
    );
  }

  let count = 1;
  let formattedMarkup = '';

  if (markup.length) {
    count = markup.length;
    formattedMarkup = ` Offending nodes are: \n${markup.join('\n')}`;
  }

  const plural = count === 1 ? '' : 's';
  const violationCount = `Violated ${count} time${plural}.`;

  return `[${violation.impact}]: ${violation.help} \n${violationCount}${formattedMarkup}\n${violation.helpUrl}`;
}
