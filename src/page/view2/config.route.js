(function() {
    'use strict';

    angular
        .module('jm-np.view2')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/view2',
                config: {
                    template: require('./view2.html'),
                    controller: 'View2Ctrl',
                    controllerAs: 'vm',
                    title: 'View2',
                    settings: {
                        // nav: 1,
                        // content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }
})();

