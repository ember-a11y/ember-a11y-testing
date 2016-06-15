'use strict';

module.exports = {
  normalizeEntityName: function() { },

  afterInstall: function() {
    return this.addBowerPackageToProject('axe-core', '1.1.1');
  }
};
