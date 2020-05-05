'use strict';

var path = require('path');
var fs = require('fs');
var Funnel = require('broccoli-funnel');
var VersionChecker = require('ember-cli-version-checker');

// The different types/area for which we have content for.
var ALLOWED_CONTENT_FOR = [
  'head-footer',
  'test-head-footer'
];

module.exports = {
  name: require('./package').name,

  /**
   * Includes axe-core in builds that have tests. It includes the un-minified
   * version in case of a need to debug.
   * @override
   */
  included: function(app) {
    var config = this.project.config();
    var options = (config[this.name] && config[this.name].componentOptions) || {};
    var isComponentAuditOff = options.turnAuditOff || false;
    var shouldExcludeAxeCore = isComponentAuditOff && options.excludeAxeCore;

    this._super.included.apply(this, arguments);

    if (app.tests) {
      app.import('vendor/axe-core/axe.js', shouldExcludeAxeCore ? { type: 'test' } : undefined);
    }
  },

  treeForVendor: function() {
    var axePath = path.dirname(require.resolve('axe-core'));
    return new Funnel(axePath, {
      files: ['axe.js'],
      destDir: 'axe-core'
    });
  },

  /**
   * Adds content for the areas specified in the array above. It appends the
   * contents of the files with the same name to the content-for block.
   * @override
   */
  contentFor: function(type) {
    if (process.env.EMBER_ENV !== 'production' && ~ALLOWED_CONTENT_FOR.indexOf(type)) {
      return fs.readFileSync(path.join(__dirname, 'content-for', type + '.html'));
    }
  },

  /**
   * Exclude the self-auditing components code during build if this is a
   * production build or if the version of Ember being used is less than 1.13.
   * @override
   */
  treeForApp: function(tree) {
    var checker = new VersionChecker(this);
    var isProductionBuild = process.env.EMBER_ENV === 'production';
    var isOldEmber = checker.for('ember-source').lt('1.13.0');

    if (isProductionBuild || isOldEmber) {
      tree = new Funnel(tree, {
        exclude: [/instance-initializers\/(axe-component|violations-helper)\.js/]
      });
    }

    return tree;
  },

  /**
   * Exclude all addon code during build if this is a
   * production build or if the version of Ember being used is less than 1.13.
   * @override
   */
  treeForAddon: function() {
    var tree = this._super.treeForAddon.apply(this, arguments);
    var checker = new VersionChecker(this);
    var isProductionBuild = process.env.EMBER_ENV === 'production';
    var isOldEmber = checker.for('ember-source').lt('1.13.0');

    if (isProductionBuild || isOldEmber) {
      tree = new Funnel(tree, {
        exclude: [
          /instance-initializers\/(axe-component|violations-helper)\.js/,
          /utils\/(concurrent-axe|format-violation|is-background-replaced-element|violations-helper)\.js/
        ]
      });
    }

    return tree;
  }

};
