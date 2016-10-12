(function() {
    'use strict';

    angular
        .module('jm-np.project')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/karta/projekt/:slug',
                config: {
                    template: require("../../../page/templates/project/project.tpl.html"),
                    controller: 'ProjectCtrl',
                    //controllerAs: 'app',
                    title: 'project',
                    settings: {
                        // nav: 1,
                        // content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }
})();

