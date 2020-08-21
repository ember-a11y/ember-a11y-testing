(function () {
  function vendorModule() {
    'use strict';

    return self['axe'];
  }

  define('axe-core', [], vendorModule);
})();
