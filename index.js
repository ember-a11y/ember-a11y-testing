/* jshint node: true */
'use strict';

var path = require('path');
var fs = require('fs');

var ALLOWED_CONTENT_FOR = [
  'test-head-footer',
  'test-body-footer'
];

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
  },

  contentFor: function(type) {
    if (~ALLOWED_CONTENT_FOR.indexOf(type)) {
      return fs.readFileSync(path.join(__dirname, 'content-for', type + '.html'));
    }
  }
};
