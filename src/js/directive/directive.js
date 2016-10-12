(function() {
    function fallbackImg() {
        return {
            link: function(scope, iElement, iAttrs) {
                iElement.on("error", function() {
                    angular.element(this).attr("src", iAttrs.fallbackImg)

                    // todo: if this img is already the no-img, then set to off.
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
                vm.currentProject = function(project) {
                    return void 0 === $routeParams.slug ? false : project.indexOf($routeParams.slug) > -1 ? true : false
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
                    console.log('continent:broadcast', data); // 'Broadcast!'
                    var xy = scope.map.lonlat2xy([data[0], data[1]]);
                    var x = xy[0], y = xy[1]
                    console.log('var x = xy[0], y = xy[1]', x, y); // 'Broadcast!'

                    $timeout(function() {
                        // recalc the project position
                        scope.countProjectPosition(x, y)
                    }, 500)
                });
            }
        }
    }
    map.$inject = ["$rootScope", "$q", "$timeout", "$window", "$routeParams", "Modernizr", "$filter", "AppService"]
    angular.module("jm-np.directive").directive("map", map)
}());

(function() {
    function mapProject(a, b, c, d, e, Modernizr) {
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
                scope.setProjectState = function() {
                    var className = "";
                    this.item.points.length > 1 && (className += "is-merged ");
                    void 0 === this.item.x && (className += "is-unpositioned ");
                    this.item.projectOfTheMonth === true && (className += "is-projectOfTheMonth ");
                    this.item.projectDisaster === true && (className += "is-disaster ");
                    iElement.addClass(className)
                };
                scope.setPosition = function() {
                    iElement.css({
                        top: scope.item.y + "px",
                        left: scope.item.x + "px"
                    })
                };
                angular.element(iElement).on("mouseenter", function() {
                    Modernizr.touch || (angular.element(this).scope().state.popupVisible = true, scope.disableScroll())
                });
                angular.element(iElement).on("mouseleave", function() {
                    Modernizr.touch || (angular.element(this).scope().state.popupVisible = false, scope.activateScroll())
                });
                scope.openProject = function() {
                    // this.item.points.length > 1 ? (scope.app.panel.navigationActive = "mobile-popup", scope.app.panel.mobilePopupItems = window._.chain(this.item.points).groupBy("country_name").pairs().map(function(a) {
                    //     return window._.object(window._.zip(["country_name", "contries"], a))
                    // }).value(), scope.app.panel.viewActive && (scope.app.panel.viewActive = !1, scope.app.panel.viewVisible = !1)) : scope.app.openView(this.item.points[0].project_number)

                    if (this.item.points.length > 1) {
                        scope.app.panel.navigationActive = "mobile-popup";
                        scope.app.panel.mobilePopupItems = window._.chain(this.item.points).groupBy("country_name").pairs().map(function(a) {
                            return window._.object(window._.zip(["country_name", "contries"], a))
                        }).value();
                        scope.app.panel.viewActive && (scope.app.panel.viewActive = false, scope.app.panel.viewVisible = false)
                    } else {
                        scope.app.openView(this.item.points[0].project_number)
                    }
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
    function overviewPanel($rootScope, AppService) {
        return {
            restrict: "AE",
            replace: "true",
            scope: {},
            link: function(scope) {
                scope.app = AppService;
                scope.listType = "thumbnails";
                scope.projectsData = $rootScope.projectsData
            },
            template: require("../../page/templates/navigation/overview/overview.tpl.html")
        }
    }
    overviewPanel.$inject = ["$rootScope", "AppService"];
    angular.module("jm-np.directive").directive("overviewPanel", overviewPanel)
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


(function() {
    function royalSlider($timeout, $q, AppService) {
        return {
            restrict: "AC",
            link: function(scope, iElement, iAttrs) {
                function promiser() {
                    var defer = $q.defer();
                    return $timeout(function() {
                        defer.resolve(), iElement.royalSlider(option)
                    }, 0), defer.promise
                }

                function rsSlideCount() {
                    _$rsSlideCount.html(royalSlider.currSlideId + 1 + "/" + royalSlider.numSlides)
                }
                scope.app = AppService;
                var royalSlider, _$rsSlideCount, option = {
                        autoScaleSlider: !0,
                        autoScaleSliderWidth: 420,
                        autoScaleSliderHeight: iAttrs.autoscalesliderheight || 263,
                        arrowsNav: iAttrs.arrowsnav || !1,
                        arrowsNavAutoHide: !1,
                        fadeinLoadedSlide: !0,
                        controlNavigation: iAttrs.controlnavigation || "bullets",
                        imageScaleMode: "fill",
                        imageAlignCenter: !0,
                        loop: !1,
                        loopRewind: !1,
                        numImagesToPreload: 4,
                        keyboardNavEnabled: !0,
                        navigateByClick: !1,
                        slidesSpacing: 0,
                        addActiveClass: !0,
                        globalCaption: !1
                    },
                    btnContainer = '<div class="buttons"></div>',
                    btnLeft = '<span class="btn btn-left"><svg class="svg-icon"><use xlink:href="/assets/svg/icons.svg#arrow-left"></use></svg></span>',
                    btnRight = '<span class="btn btn-right"><svg class="svg-icon"><use xlink:href="/assets/svg/icons.svg#arrow-right"></use></svg></span>';
                promiser().then(function() {
                    iElement.show(), royalSlider = iElement.data("royalSlider"), (iAttrs.showindex || iAttrs.showarrows) && (btnContainer = angular.element(btnContainer).appendTo(iElement)), iAttrs.showindex && (_$rsSlideCount = angular.element('<div class="rsSlideCount"></div>').appendTo(btnContainer), rsSlideCount()), iAttrs.showarrows && (btnLeft = angular.element(btnLeft).appendTo(btnContainer), btnRight = angular.element(btnRight).appendTo(btnContainer), btnLeft.on("click", function(event) {
                        event.stopPropagation(), royalSlider.prev()
                    }), btnRight.on("click", function(event) {
                        event.stopPropagation(), royalSlider.next()
                    })), iAttrs.clickable && royalSlider.ev.on("rsSlideClick", function(event) {
                        scope.app.openView(angular.element(event.currentTarget.currSlide.content).data("slug"))
                    }), royalSlider.ev.on("rsAfterSlideChange", function() {
                        iAttrs.showindex && rsSlideCount()
                    })
                }), scope.$on("$destroy", function() {
                    iAttrs.showarrows && (btnRight.off(), btnLeft.off()), royalSlider.destroy()
                })
            }
        }
    }
    royalSlider.$inject = ["$timeout", "$q", "AppService"], angular.module("royalSlider", []).directive("royalSlider", royalSlider)
}());

(function() {
    function vimeoPlayer($compile, $timeout) {
        return {
            scope: {
                videoUrl: "@"
            },
            restrict: "E",
            replace: "false",
            link: function(c) {
                function d() {
                    f()
                }

                function e(a) {
                    return a.match(/[0-9]+/g)[0]
                }

                function f() {
                    $compile(h)(c, function(a) {
                        h = a
                    })
                }
                var g = !1,
                    h = [];
                c.videoId = e(c.videoUrl), c.openModal = function() {
                    g = !g;
                    var a = angular.element(h);
                    angular.element("body").append(h), a.prepend('<div id="loading-bar-spinner" class="loading-bar-spinner white"><div class="spinner-icon"></div></div>');
                    var c = angular.element("#vimeoplayer")[0],
                        d = window.$f(c);
                    $timeout(function() {
                        a.addClass("is-loaded")
                    }, 100), $timeout(function() {
                        d.addEvent("ready", function() {
                            d.api("play"), a.find(".e-loader").remove()
                        })
                    }, 1e3)
                }, c.closeModal = function() {
                    g = !g, angular.element(h).detach(), angular.element(h).removeClass("is-loaded")
                }, c.$on("$destroy", function() {
                    angular.element(h).remove()
                }), h = ['<div id="modal" class="m-vimeo-modal">', '<div class="vimeo-backdrop" ng-click="closeModal()"></div>', '<span class="btn-close icon icon_svk_close" ng-click="closeModal()">', '<svg class="svg-icon"><use xlink:href="/assets/svg/icons.svg#close"></use></svg>', "</span>", '<div class="vimeo-container">', '<iframe id="vimeoplayer" src="//player.vimeo.com/video/' + c.videoId + '?portrait=0&api=1" width="960" height="540" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>', "</div>", "</div>"].join(""), d()
            },
            template: '<span class="vimeo-video" ng-click="openModal()"><svg class="svg-icon"><use xlink:href="/assets/svg/icons.svg#play"></use></svg></span>'
        }
    }
    vimeoPlayer.$inject = ["$compile", "$timeout"], angular.module("jm-np.directive").directive("vimeoPlayer", vimeoPlayer)
}());