'use strict';

module.exports = {
  normalizeEntityName: function() { },

  afterInstall: function() {
    return this.addBowerPackageToProject('axe-core', '~2.1.7');
  }
};
