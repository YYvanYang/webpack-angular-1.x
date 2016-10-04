(function () {
    'use strict';

    angular.module('jm-np.view2', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/view2', {
                template: require('./view2.html'),
                controller: 'View2Ctrl',
                controllerAs: 'vm',
                resolve: {
                    loadCtrl: ['$q', function ($q) {
                        var defer = $q.defer();
                        require.ensure([], function (require) {
                            defer.resolve(require('./view2.js'));
                        });
                        return defer.promise;
                    }]
                }
            });
        }]);

})();