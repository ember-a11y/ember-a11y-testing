/* globals module */

var EOL = require('os').EOL;

module.exports = {
  description: 'Register test helpers',

  afterInstall: function() {
    var startAppFile = 'tests/helpers/start-app.js';
    var importText = 'import registerA11yHelpers from \'./a11y/register-a11y-helpers\';';
    var importLocationText = 'import Ember from \'ember\';' + EOL;
    var registerHelpersText = '    registerA11yHelpers();';
    var registerHelpersLocationText = 'application.setupForTesting();' + EOL;

    return this.insertIntoFile(startAppFile, importText, { after: importLocationText })
      .then(function() {
        return this.insertIntoFile(startAppFile, registerHelpersText, { after: registerHelpersLocationText });
      }.bind(this));
  },

  normalizeEntityName: function() {}
};
