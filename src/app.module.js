(function() {
    'use strict';

    require('./dep/normalize-css/normalize.css')
    require('./dep/toastr/toastr.css')
    require('./css/app.css')

    require('./lib/royalslider/royalslider.css')

    // http://adamish.com/blog/archives/876
    require("./js/core/helper.js")

    //<!-- Reusable Blocks/Modules -->
    require("./js/blocks/exception/exception.module.js")
    require("./js/blocks/exception/exception-handler.provider.js")
    require("./js/blocks/exception/exception.js")
    require("./js/blocks/logger/logger.module.js")
    require("./js/blocks/logger/logger.js")
    require("./js/blocks/router/router.module.js")
    require("./js/blocks/router/routehelper.js")

    //<!-- core module -->
    require("./js/core/core.module.js")
    require("./js/core/constants.js")
    require("./js/core/config.js")
    require("./js/core/appService.js")

    require("./js/directive/directive.module.js")
    require("./js/directive/directive.js")

    require('./page/app/app.module.js');
    require('./page/app/config.route.js')
    require('./page/app/app.js')

    require('./page/project/project.module.js');
    require('./page/project/config.route.js')
    require('./page/project/project.js')

    angular.module('jm-np', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         * and then when app.dashboard tries to use app.data,
         * its components are available.
         */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */ 
        'app.core',
        //'app.widgets',

        'pasvaz.bindonce',
        'jm-np.directive',

        'royalSlider',

        /*
         * Feature areas
         */
        //'app.avengers',
        //'app.dashboard',
        //'app.layout'
        'jm-np.app',
        'jm-np.project'
    ]);

})();
