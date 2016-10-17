(function() {
    'use strict';

    angular
        .module('jm-np.app')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/:language',
                config: {
                    controller: 'AppCtrl',
                    //controllerAs: 'app',
                    title: 'app',
                    settings: {
                        // nav: 1,
                        // content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }
})();

