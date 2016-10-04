'use strict';

require('./dep/normalize-css/normalize.css')
require('./css/app.css')

require('./page/view1/view1.module.js')
require('./page/view1/config.route.js')

require('./page/view2/view2.module.js')
require('./page/view2/config.route.js')

// Declare app level module which depends on views, and components
angular.module('jm-np', [
  'ngRoute',
  'jm-np.view1',
  'jm-np.view2'
])
.config(['$locationProvider', '$routeProvider','$controllerProvider', function($locationProvider, $routeProvider,$controllerProvider) {
  //$locationProvider.html5Mode(true);
 // $locationProvider.hashPrefix('!');
  angular.module('jm-np').controllerProvider = $controllerProvider;
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
