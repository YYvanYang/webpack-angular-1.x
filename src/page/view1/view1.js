(function () {
  'use strict';

  angular.module('jm-np')
    .controllerProvider.register('View1Ctrl', [function () {
        var vm = this;
        vm.val = 'from jm-np.view1';
    }])
})()