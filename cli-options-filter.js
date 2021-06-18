'use strict';

const Filter = require('broccoli-persistent-filter');

const enableMiddlewareReporter =
  process.env.ENABLE_A11Y_MIDDLEWARE_REPORTER === 'true';
const enableA11yAudit = process.env.ENABLE_A11Y_AUDIT === 'true';

const replacementToken = '$1 true';

class CliOptionsFilter extends Filter {
  constructor() {
    super(...arguments);
  }

  /**
   * If `ENABLE_A11Y_MIDDLEWARE_REPORTER=true` or `ENABLE_A11Y_AUDIT=true` environmental
   * variables are specified, overwrite the corresponding values in `test-support/cli-options`
   * at build-time to make them accessible in the browser environment.
   * @override
   */
  processString(contents) {
    if (enableMiddlewareReporter) {
      contents = contents.replace(
        /(ENABLE_A11Y_MIDDLEWARE_REPORTER = )false/,
        replacementToken
      );
    }

    if (enableA11yAudit) {
      contents = contents.replace(
        /(ENABLE_A11Y_AUDIT = )false/,
        replacementToken
      );
    }

    return contents;
  }
}

module.exports = CliOptionsFilter;
