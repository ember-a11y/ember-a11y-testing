(function () {
  function vendorModule() {
    'use strict';

    return {
      default: self['axe-core'],
      __esModule: true,
    };
  }

  define('axe-core', [], vendorModule);
})();
