(function() {
    'use strict';

    angular
        .module('jm-np.view1')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/view1',
                config: {
                    template: require('./view1.html'),
                    controller: 'View1Ctrl',
                    controllerAs: 'vm',
                    title: 'View1',
                    settings: {
                        // nav: 1,
                        // content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }
})();

