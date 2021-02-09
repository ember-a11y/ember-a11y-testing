'use strict';

const path = require('path');
const fs = require('fs');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const VersionChecker = require('ember-cli-version-checker');
const validatePeerDependencies = require('validate-peer-dependencies');
const setupMiddleware = require('./setup-middleware');

// The different types/area for which we have content for.
const ALLOWED_CONTENT_FOR = ['head-footer', 'test-head-footer'];

module.exports = {
  name: require('./package').name,

  init() {
    this._super.init.apply(this, arguments);

    let versionChecker = new VersionChecker(this.project);

    validatePeerDependencies(__dirname, {
      resolvePeerDependenciesFrom: this.parent.root,
    });

    const hasMagicallyProvidedQUnit = versionChecker
      .for('ember-qunit')
      .lt('5.0.0-beta.1');

    // Ember-qunit < 5 provides an AMD shim for qunit but newer version now use
    // ember-auto-import to include qunit. This means that qunit is no
    // longer available for addons (if the parent app is using ember-qunit > 5) to
    // directly import under embroider unless they are using ember-auto-import
    // themselves. This condidionally falls back to not using ember-auto-import
    // when the parent app is providing qunit because without this we would double
    // include qunit resulting in a runtime error (qunit detects if it as
    // already be added to the window object and errors if so).
    if (hasMagicallyProvidedQUnit) {
      this.options = this.options || {};
      this.options.autoImport = {
        exclude: ['qunit'],
      };
    }
  },

  /**
   * Includes axe-core in builds that have tests. It includes the un-minified
   * version in case of a need to debug.
   * @override
   */
  included: function (app) {
    this._super.included.apply(this, arguments);

    if (app.tests) {
      let type = { type: 'test' };
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

  serverMiddleware(startOptions) {
    setupMiddleware(startOptions.app, {
      root: this.project.root,
    });
  },

  testemMiddleware(app) {
    setupMiddleware(app, {
      root: this.project.root,
    });
  },
};
