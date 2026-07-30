import axeCore from 'axe-core';

/**
 * This file is heavily borrowed from https://github.com/dequelabs/react-axe/blob/d3245b32fc5ed19e3c7b2c43d2815fe63f5875cb/index.ts
 *
 * An issue (https://github.com/dequelabs/react-axe/issues/180) has been opened which
 * suggests extracting out the common pieces of axe formatting to a separate repository,
 * which would allow a lot of these functions to be removed.
 */

// @reference axe-core https://github.com/dequelabs/axe-core/blob/develop/lib/core/base/audit.js

// contrasted against Chrome default color of #ffffff
const lightTheme = {
  serious: '#d93251',
  minor: '#d24700',
  text: 'black'
};

// contrasted against Safari dark mode color of #535353
const darkTheme = {
  serious: '#ffb3b3',
  minor: '#ffd500',
  text: 'white'
};
const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
const boldCourier = 'font-weight:bold;font-family:Courier;';
const critical = `color:${theme.serious};font-weight:bold;`;
const serious = `color:${theme.serious};font-weight:normal;`;
const moderate = `color:${theme.minor};font-weight:bold;`;
const minor = `color:${theme.minor};font-weight:normal;`;
const defaultReset = `font-color:${theme.text};font-weight:normal;`;
const testSuiteResults = [];
const cache = {};
function deduplicateViolations(results) {
  return results.violations.filter(result => {
    result.nodes = result.nodes.filter(node => {
      const key = node.target.toString() + result.id;
      const retVal = !cache[key];
      cache[key] = key;
      return retVal;
    });
    return !!result.nodes.length;
  });
}

/**
 * Log the axe result node to the console
 *
 * @param {NodeResult} node
 * @param {Function} logFn console log function to use (error, warn, log, etc.)
 */
function logElement(node, logFn) {
  const el = document.querySelector(node.target.toString());
  if (!el) {
    logFn('Selector: %c%s', boldCourier, node.target.toString());
  } else {
    logFn('Element: %o', el);
  }
}

/**
 * Log the axe result node html to the console
 *
 * @param {NodeResult} node
 */
function logHtml(node) {
  console.log('HTML: %c%s', boldCourier, node.html);
}

/**
 * Log the failure message of a node result.
 *
 * @param {NodeResult} node
 * @param {String} key which check array to log from (any, all, none)
 */
function logFailureMessage(node, key) {
  // this exists on axe but we don't export it as part of the typescript
  // namespace, so just let me use it as I need
  const message = axeCore._audit.data.failureSummaries[key].failureMessage(node[key].map(check => check.message || ''));
  console.error(message);
}

/**
 * Log as a group the node result and failure message.
 *
 * @param {NodeResult} node
 * @param {String} key which check array to log from (any, all, none)
 */
function failureSummary(node, key) {
  if (node[key].length > 0) {
    logElement(node, console.groupCollapsed);
    logHtml(node);
    logFailureMessage(node, key);
    let relatedNodes = [];
    node[key].forEach(check => {
      relatedNodes = relatedNodes.concat(check.relatedNodes || []);
    });
    if (relatedNodes.length > 0) {
      console.groupCollapsed('Related nodes');
      relatedNodes.forEach(relatedNode => {
        logElement(relatedNode, console.log);
        logHtml(relatedNode);
      });
      console.groupEnd();
    }
    console.groupEnd();
  }
}

/**
 * @public
 * @param results The axe results.
 */
function storeResults(results) {
  if (results.violations.length > 0) {
    testSuiteResults.push(deduplicateViolations(results));
  }
}

/**
 * Prints aggregated axe results to the console.
 *
 * @public
 */
function printResults() {
  if (testSuiteResults.length) {
    console.group('%cAxe issues', serious);
    testSuiteResults.forEach(results => {
      results.forEach(result => {
        let fmt;
        switch (result.impact) {
          case 'critical':
            fmt = critical;
            break;
          case 'serious':
            fmt = serious;
            break;
          case 'moderate':
            fmt = moderate;
            break;
          case 'minor':
            fmt = minor;
            break;
          default:
            fmt = minor;
            break;
        }
        console.groupCollapsed('%c%s: %c%s %s', fmt, result.impact, defaultReset, result.help, result.helpUrl);
        result.nodes.forEach(node => {
          failureSummary(node, 'any');
          failureSummary(node, 'none');
        });
        console.groupEnd();
      });
    });
    console.groupEnd();
  }
}

export { printResults, storeResults };
//# sourceMappingURL=logger.js.map
