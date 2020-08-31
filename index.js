'use strict';

const path = require('path');
const fs = require('fs');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const VersionChecker = require('ember-cli-version-checker');

// The different types/area for which we have content for.
const ALLOWED_CONTENT_FOR = ['head-footer', 'test-head-footer'];

module.exports = {
  name: require('./package').name,

  /**
   * Includes axe-core in builds that have tests. It includes the un-minified
   * version in case of a need to debug.
   * @override
   */
  included: function (app) {
    let config = this.project.config();
    let options =
      (config[this.name] && config[this.name].componentOptions) || {};
    let isComponentAuditOff = options.turnAuditOff || false;
    let shouldExcludeAxeCore = isComponentAuditOff && options.excludeAxeCore;

    this._super.included.apply(this, arguments);

    let checker = VersionChecker.forProject(this.project);
    let check = checker.check({
      '@ember/test-helpers': '>= 2.0.0-beta.6',
    });

    check.assert(
      `[ember-a11y-testing] Missing required version of @ember/test-helpers`
    );

    if (app.tests) {
      let type = shouldExcludeAxeCore ? { type: 'test' } : undefined;
      app.import('vendor/axe-core/axe.js', type);
      app.import('vendor/shims/axe-core.js', type);
    }
  },

  treeForVendor: function (tree) {
    let axePath = path.dirname(require.resolve('axe-core'));
    let axeTree = new Funnel(axePath, {
      files: ['axe.js'],
      destDir: 'axe-core',
    });

    return new MergeTrees([tree, axeTree]);
  },

  /**
   * Adds content for the areas specified in the array above. It appends the
   * contents of the files with the same name to the content-for block.
   * @override
   */
  contentFor: function (type) {
    if (
      process.env.EMBER_ENV !== 'production' &&
      ~ALLOWED_CONTENT_FOR.indexOf(type)
    ) {
      return fs.readFileSync(
        path.join(__dirname, 'content-for', type + '.html')
      );
    }
  },
};
