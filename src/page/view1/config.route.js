(function () {
    'use strict';

    angular.module('jm-np.view1', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/view1', {
                template: require('./view1.html'),
                controller: 'View1Ctrl',
                controllerAs: 'vm',
                resolve: {
                    loadCtrl: ['$q', function ($q) {
                        var defer = $q.defer();
                        require.ensure([], function (require) {
                            defer.resolve(require('./view1.js'));
                        });
                        return defer.promise;
                    }]
                }
            });
        }]);
})();
