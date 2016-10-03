'use strict';

require('./dep/normalize-css/normalize.css')
require('./css/app.css')
require('./page/view1/view1.js')
require('./page/view2/view2.js')

// Declare app level module which depends on views, and components
angular.module('jm-np', [
  'ngRoute',
  'jm-np.view1',
  'jm-np.view2'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  //$locationProvider.html5Mode(true);
 // $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
