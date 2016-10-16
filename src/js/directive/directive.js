(function() {
    function fallbackImg() {
        return {
            link: function(scope, iElement, iAttrs) {
                iElement.on("error", function() {
                    angular.element(this).attr("src", iAttrs.fallbackImg)

                    // if this img is already the no-img, then set to off.
                    iElement.off("error");
                })
            }
        }
    }
    angular.module("jm-np.directive").directive("fallbackImg", fallbackImg)
}());

(function() {
    function map($rootScope, $q, $timeout, $window, $routeParams, Modernizr, $filter, AppService) {
        return {
            restrict: "A",
            replace: true,
            scope: {},
            transclude: true,
            template: require("../../page/templates/map/map.tpl.html"),
            controllerAs: "ctrl",
            controller: function() {
                var vm = this;
                vm.currentProject = function(slug) {
                    return void 0 === $routeParams.slug ? false : slug.indexOf($routeParams.slug) > -1 ? true : false
                }
            },
            link: function(scope) {
                scope.app = AppService;
                scope.clusters = [];
                scope.filteredClusters = [];
                scope.map = kartograph.map("#map");
                scope.filteredProjectsData = [];
                scope.mouseover = false;
                var mapContainer = angular.element("#m-map-container"),
                    defer = $q.defer(),
                    svgMap = '<svg enable_background="new 0 0 1000 464" height="464px" pretty_print="False" style="stroke-linejoin: round; stroke:#000; fill: none;" version="1.1" viewBox="0 0 1000 464" width="1000px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"><![CDATA[path { fill-rule: evenodd; }]]></style></defs><metadata><views><view h="464.28870594" padding="0" w="1000"><proj flip="auto" id="robinson" lon0="0"/><bbox h="2161.69" w="4665.97" x="-1999.7" y="-1168.29"/></view></views></metadata></svg>';
                scope.countProjectPosition = function(x, y) {
                    var c, left, top, width = $window.innerWidth,
                        height = $window.innerHeight,
                        i = 70,
                        k = .4,
                        l = -30;
                    c = width * k;
                    left = x - (c + i + l);
                    top = y - height / 2;
                    mapContainer.animate({
                        scrollTop: top,
                        scrollLeft: left
                    }, 300)
                };
                var lonlat2xy = function() {
                        angular.element.each(scope.filteredProjectsData, function(index, project) {
                            if (project.has_position) {
                                var xy = scope.map.lonlat2xy([project.lon, project.lat]);
                                project.x = xy[0], project.y = xy[1]
                            }
                        })
                    },
                    n = function() {
                        scope.clusters = MapUtilities.cluster_hierarchical_agglomerative(scope.filteredProjectsData, 40, 40);
                        defer.resolve();
                        scope.app.states.isFiltering = false;
                        angular.element("#map .project").css({
                            visibility: "visible"
                        })
                    },
                    setMap = function(filterData) {
                        scope.map.setMap(svgMap);
                        scope.filteredProjectsData = filterData;
                        lonlat2xy();
                        n()
                    };
                scope.disableScroll = function() {
                    angular.element("#m-map-container").kinetic("detach"), Modernizr.touch && (scope.app.states.isScrollable = true)
                }, scope.activateScroll = function() {
                    angular.element("#m-map-container").kinetic("attach")
                }, scope.resizeProject = function() {
                    scope.app.setBreakpoint() && (scope.map.resize(), scope.filteredProjectsData = $rootScope.filterData, lonlat2xy(), n(), scope.$$phase || scope.$apply())
                }, scope.$on("dataBroadcast", function() {
                    scope.app.setBreakpoint(), $timeout(function() {
                        setMap($rootScope.filterData)
                    }, 200);
                    var left = 900,
                        top = 200;
                    $timeout(function() {
                        angular.element("#m-map-container").animate({
                            scrollTop: top,
                            scrollLeft: left
                        }, 0)
                    }, 0)
                }), angular.element($window).on("resize", function() {
                    scope.resizeProject()
                }), scope.$on("$routeChangeSuccess", function() {
                    void 0 === $routeParams.slug || Modernizr.touch || defer.promise.then(function() {
                        var cluster = $filter("filter")(scope.clusters, {
                            slug: $routeParams.slug
                        }, false);
                        cluster.length && void 0 !== cluster[0].x && (angular.element("html").hasClass("lt-ie9") || $timeout(function() {
                            // recalc the project position
                            scope.countProjectPosition(cluster[0].x, cluster[0].y)
                        }, 500))
                    })
                })

                $rootScope.$on('continent:broadcast', function (event, data) {
                    //console.log('continent:broadcast', data);
                    var xy = scope.map.lonlat2xy([data[0], data[1]]);
                    var x = xy[0], y = xy[1]
                    //console.log('var x = xy[0], y = xy[1]', x, y);

                    $timeout(function() {
                        // recalc the project position
                        scope.countProjectPosition(x, y)
                    }, 500)
                });

                $rootScope.$on('country:broadcast', function (event, data) {
                    var project_number = data;
                    //scope.app.activing_project_number = project_number;
                    //console.log('continent:broadcast', data);
                    var cluster = $filter("filter")(scope.clusters, {
                        slug: project_number
                    }, false);

                    // clear actived items
                    for(var item in scope.clusters) {
                        if (scope.clusters[item].slug != project_number) {
                            scope.clusters[item].popupVisible = null;
                        }
                    }

                    cluster.length && void 0 !== cluster[0].x && (angular.element("html").hasClass("lt-ie9") || $timeout(function() {
                        // recalc the project position
                        scope.countProjectPosition(cluster[0].x, cluster[0].y)

                        $timeout(function () {
                            // todo: display popup
                            // var cluster = $filter("filter")(scope.clusters, {
                            //     slug: $routeParams.slug
                            // }, false);
                            //var cluster = scope.clusters[0];
                            cluster[0].popupVisible = true;

                        },500)

                    }, 500))


                    // $timeout(function() {
                    //     // recalc the project position
                    //     scope.countProjectPosition(x, y)
                    //     $timeout(function () {
                    //         // todo: display popup
                    //         // var cluster = $filter("filter")(scope.clusters, {
                    //         //     slug: $routeParams.slug
                    //         // }, false);
                    //         var cluster = scope.clusters[0];
                    //         cluster.popupVisible = true;
                    //
                    //     },300)
                    // }, 500)
                });

                scope.$on('popupVisible:mouseenter', function (event, data) {
                    var project_number = data;
                    for(var item in scope.clusters) {
                        if (scope.clusters[item].slug != project_number) {
                            scope.clusters[item].popupVisible = null;
                        }
                    }
                });
            }
        }
    }
    map.$inject = ["$rootScope", "$q", "$timeout", "$window", "$routeParams", "Modernizr", "$filter", "AppService"]
    angular.module("jm-np.directive").directive("map", map)
}());

(function() {
    function mapProject(a, b, c, $window, e, Modernizr) {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            require: "^map",
            template: require("../../page/templates/map/mapProject.tpl.html"),
            link: function(scope, iElement) {
                scope.state = {
                    popupVisible: false
                };

                // todo: add watch
                scope.$watch("item.popupVisible", function(value) {
                    //if (value) {
                        scope.state.popupVisible = !!value;
                    //}

                })

                scope.setProjectState = function() {
                    var className = "";
                    this.item.points.length > 1 && (className += "is-merged ");
                    void 0 === this.item.x && (className += "is-unpositioned ");
                    //this.item.projectOfTheMonth === true && (className += "is-projectOfTheMonth ");
                    //this.item.projectDisaster === true && (className += "is-disaster ");
                    iElement.addClass(className)
                };
                scope.setPosition = function() {
                    iElement.css({
                        top: scope.item.y + "px",
                        left: scope.item.x + "px"
                    })
                };
                angular.element(iElement).on("mouseenter", function(event) {

                    if (jQuery(event.target).hasClass('map-point-country-name')) {
                        return;
                    }
                    // close popup that displayed by search
                    var project_number = scope.item.slug;
                    scope.$emit('popupVisible:mouseenter', project_number);

                    Modernizr.touch || (angular.element(this).scope().state.popupVisible = true, scope.disableScroll())

                });
                angular.element(iElement).on("mouseleave", function(event) {
                    if (jQuery(event.target).hasClass('map-point-country-name')) {
                        return;
                    }

                    Modernizr.touch || (angular.element(this).scope().state.popupVisible = false, scope.activateScroll())
                    scope.item.popupVisible = false;
                });
                scope.openProject = function(event) {
                    // this.item.points.length > 1 ? (scope.app.panel.navigationActive = "mobile-popup", scope.app.panel.mobilePopupItems = window._.chain(this.item.points).groupBy("country_name").pairs().map(function(a) {
                    //     return window._.object(window._.zip(["country_name", "contries"], a))
                    // }).value(), scope.app.panel.viewActive && (scope.app.panel.viewActive = !1, scope.app.panel.viewVisible = !1)) : scope.app.openView(this.item.points[0].project_number)

                    // if (this.item.points.length > 1) {
                    //     scope.app.panel.navigationActive = "mobile-popup";
                    //     scope.app.panel.mobilePopupItems = window._.chain(this.item.points).groupBy("country_name").pairs().map(function(a) {
                    //         return window._.object(window._.zip(["country_name", "contries"], a))
                    //     }).value();
                    //     scope.app.panel.viewActive && (scope.app.panel.viewActive = false, scope.app.panel.viewVisible = false)
                    // } else {
                       // scope.app.openView(this.item.points[0].project_number)
                    // }
                    if (jQuery(event.target).hasClass('map-point-country-name')) {
                        return;
                    }
                    $window.open(this.item.points[0].link, '_blank');
                };
                scope.setProjectState();
                scope.setPosition()
            }
        }
    }
    mapProject.$inject = ["$rootScope", "$q", "$timeout", "$window", "$routeParams", "Modernizr"]
    angular.module("jm-np.directive").directive("mapProject", mapProject)
}());


(function() {
    function details($timeout, b, Modernizr) {
        return {
            restrict: "EA",
            replace: true,
            scope: {},
            template: require("../../page/templates/map/details.tpl.html"),
            link: function(scope, iElement) {
                Modernizr.touch || ($timeout(function() {
                    iElement.addClass("is-loaded");
                    iElement.find(".boat-container").addClass("animate");
                    iElement.find(".airplane-container").addClass("animate");
                }, 2000), Modernizr.csstransforms3d && angular.element("#m-map-container").on("scroll", function() {
                    var _$this = angular.element(this),
                        top = _$this.scrollTop(),
                        left = _$this.scrollLeft();
                    angular.element(".cloud-1").css({
                        "-webkit-transform": "translate3d(" + left * -.1 + "px, " + .3 * top + "px, 0)",
                        transform: "translate3d(" + left * -.1 + "px, " + .3 * top + "px, 0)"
                    }), angular.element(".cloud-2").css({
                        "-webkit-transform": "translate3d(" + .3 * left + "px, " + .2 * top + "px, 0)",
                        transform: "translate3d(" + .3 * left + "px, " + .2 * top + "px, 0)"
                    }), angular.element(".cloud-3").css({
                        "-webkit-transform": "translate3d(" + left * -.1 + "px, " + top * -.1 + "px, 0)",
                        transform: "translate3d(" + left * -.1 + "px, " + top * -.1 + "px, 0)"
                    }), angular.element(".cloud-4").css({
                        "-webkit-transform": "translate3d(" + .2 * left + "px, " + .3 * top + "px, 0)",
                        transform: "translate3d(" + .2 * left + "px, " + .3 * top + "px, 0)"
                    }), angular.element(".cloud-5").css({
                        "-webkit-transform": "translate3d(" + left * -.2 + "px, " + .2 * top + "px, 0)",
                        transform: "translate3d(" + left * -.2 + "px, " + .2 * top + "px, 0)"
                    })
                }))
            }
        }
    }
    details.$inject = ["$timeout", "$rootScope", "Modernizr"];
    angular.module("jm-np.directive").directive("details", details)
}());

(function() {
    function navigationBar(a, AppService) {
        return {
            restrict: "AE",
            replace: "true",
            scope: {},
            link: function(scope, iElement) {
                var activeItem;
                scope.app = AppService;
                scope.toggle = function($event, item) {
                    iElement.find(".is-active").removeClass("is-active");
                    item === activeItem ? activeItem = "" : (activeItem = item, angular.element($event.currentTarget).toggleClass("is-active"));
                    scope.app.togglePanel(item)
                };
                scope.$watch("app.panel.navigationActive", function(value) {
                    "" === value && (activeItem = "", iElement.find(".is-active").removeClass("is-active"))
                })
            },
            template: require("../../page/templates/navigation/navigation-bar.tpl.html")
        }
    }
    navigationBar.$inject = ["$rootScope", "AppService"], angular.module("jm-np.directive").directive("navigationBar", navigationBar)
}());

(function() {
    function footerBar() {
        return {
            restrict: "AE",
            replace: true,
            template: require("../../page/templates/navigation/footer/footer-bar.tpl.html")
        }
    }
    angular.module("jm-np.directive").directive("footerBar", footerBar)
}());

(function() {
    function continentNavBar($rootScope) {
        return {
            restrict: "AE",
            replace: true,
            template: require("../../page/templates/navigation/continent-nav/continent-nav-bar.html"),
            link: function(scope, element, attrs) {

                scope.gotoContinent = function (longitude, latitude) {
                    $rootScope.$broadcast('continent:broadcast', [longitude, latitude]);
                };
            }
        }
    }
    continentNavBar.$inject = ["$rootScope"];
    angular.module("jm-np.directive").directive("continentNavBar", continentNavBar)
}());

(function() {
    function searchPanel() {
        return {
            restrict: "AE",
            replace: true,
            template: require("../../page/templates/navigation/search/search.tpl.html")
        }
    }
    angular.module("jm-np.directive").directive("searchPanel", searchPanel)
}());


