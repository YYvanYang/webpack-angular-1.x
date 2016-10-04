(function () {
  'use strict';

  angular.module('jm-np.view2')
      .controller('View2Ctrl', ['logger', function(logger) {
        var vm = this;
        vm.val = 'from view2 controller'
        logger.info('hello world2!!!')
      }]);

})();