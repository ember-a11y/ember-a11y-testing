/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-axe',

  /**
   * Include axe-core in non-production builds. Include the un-minified version
   * in case of a need to debug.
   * @override
   */
  included: function(app) {
    this._super.included(app);

    if (app.env !== 'production') {
      app.import(path.join(app.bowerDirectory, 'axe-core/axe.js'));
    }
  }
};
