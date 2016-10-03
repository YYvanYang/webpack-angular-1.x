'use strict';

angular.module('jm-np.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    template: require('./view1.html'),
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {
  
}]);