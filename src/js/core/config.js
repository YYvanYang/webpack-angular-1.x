(function() {
    'use strict';

    var core = angular.module('app.core');

    core.provider("Modernizr", function() {
        this.$get = function() {
            return Modernizr || {}
        }
    });

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];

    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Angular Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', '$locationProvider', '$routeProvider', 'routehelperConfigProvider', 'exceptionHandlerProvider'];

    function configure ($logProvider, $locationProvider, $routeProvider, routehelperConfigProvider, exceptionHandlerProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // http://stackoverflow.com/questions/16569841/reloading-the-page-gives-wrong-get-request-with-angularjs-html5-mode
        $locationProvider.html5Mode(true);

        // Configure the common route provider
        routehelperConfigProvider.config.$routeProvider = $routeProvider;
        routehelperConfigProvider.config.docTitle = 'NG-Modular: ';
        // var resolveAlways = {
        //     ready: ['dataservice', function (dataservice) {
        //        return dataservice.ready();
        //     }]
        // };
        // routehelperConfigProvider.config.resolveAlways = resolveAlways;

        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }

    core.run(["$rootScope", "$routeParams", "$location", "$timeout", "AppService", "Modernizr", function($rootScope, b, $location, $timeout, AppService, Modernizr) {
        var appService = AppService;
        if (Modernizr.touch && (appService.states.isTouch = true), appService.setBreakpoint(), -1 !== navigator.userAgent.indexOf("Mac OS X")) {
            angular.element("body").addClass("mac");
            Modernizr.touch || angular.element("#m-map-container").kinetic({
                triggerHardware: !0,
                slowdown: .8
            });
        }
        else {
            var ie = navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/MSIE/),
                firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
                _$body = angular.element("body");
            _$body.addClass("pc");
            ie && _$body.addClass("ie");
            firefox && _$body.addClass("firefox");

            if (Modernizr.csstransforms3d) {
                // var style = document.createElement("style");
                // style.appendChild(document.createTextNode("      @media screen and (-webkit-min-device-pixel-ratio:0) {        @font-face {          font-family: 'icons';          src: url('fonts/icons-280250e94890c84432a6e4ba3472a5e7.svg?#icons') format('svg');        }      }      "));
                // document.head.appendChild(style)
            }

            var opt = {}

            if (navigator.userAgent.match(/MSIE/)) {
                _$body.addClass("ie");
                opt = {
                    slowdown: 0
                }

                if (Modernizr.csstransforms3d && !Modernizr.touch) {
                    opt = {
                        triggerHardware: true,
                        slowdown: 0
                    }
                }
            } else {
                opt = {
                    triggerHardware: true,
                    slowdown: .5
                }
            }

            angular.element("#m-map-container").kinetic(opt)
        }

        // todo: this should be removed
        // $rootScope.$on("$routeChangeSuccess", function() {
        //     if ("/" === $location.path()) {
        //         appService.elements.navigationBar = false;
        //         appService.elements.backToStart = false;
        //         $timeout(function() {
        //             appService.panel.navigationActive = "welcome";
        //             $timeout(function() {
        //                     appService.states.isScrollable = true
        //             }, 1000)
        //         }, 1000)
        //     } else {
        //         appService.elements.navigationBar = true;
        //         appService.elements.backToStart = true;
        //         appService.states.isScrollable = false;
        //
        //         if ("welcome" === appService.panel.navigationActive)  {
        //             appService.panel.navigationActive = "";
        //         }
        //
        //         angular.element(".l-header").removeAttr("style");
        //         angular.element(window).off("mousewheel")
        //     }
        // })
    }]);
})();
