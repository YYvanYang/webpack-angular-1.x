(function () {
  'use strict';

  angular.module('jm-np.view1')
      .controller('View1Ctrl', ['logger', function(logger) {
        var vm = this;
        vm.val = 'from view1 controller'
          logger.info('hello world!!!')
      }]);

})();

