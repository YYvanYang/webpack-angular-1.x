(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('AppService', appService);

    appService.$inject = ['$location', '$timeout', '$window','$rootScope'];

    function appService($location, $timeout, $window,$rootScope) {
        var timer;
        return {
            togglePanel: function(active) {
                if (this.panel.navigationActive === active) {
                    if (this.panel.viewActive) {
                        if (this.panel.viewVisible) {
                            this.panel.viewVisible = false;
                        } else {
                            this.panel.viewVisible = true;
                            this.panel.navigationActive = "";
                        }
                    } else {
                        this.panel.navigationActive = "";
                    }
                } else {
                    this.panel.navigationActive = active;
                    this.panel.viewVisible = false;
                }
            },
            replacePoints: function() {
                $timeout.cancel(timer);
                angular.element("#m-map-container").css({
                    cursor: "wait"
                });
                angular.element("body").find(".projects").addClass("is-resizing");
                timer = $timeout(function() {
                    angular.element("#m-map-container").css({
                        cursor: "move"
                    });
                    angular.element("body").find(".projects").removeClass("is-resizing")
                }, 1000)
            },
            setBreakpoint: function() {
                var isBreakpoint, width = $window.innerWidth;
                isBreakpoint = width >= 960 ? "desktop" : width >= 600 ? "tablet" : "mobile";

                if (isBreakpoint !== this.states.isBreakpoint) {
                    this.replacePoints();
                    this.states.isBreakpoint = isBreakpoint;
                    return true;
                }

                return false;

            },
            // project_number
            displayPopup: function (id) {
                var project_number = id;
                $rootScope.$broadcast('country:broadcast', project_number);
                this.panel.navigationActive = ""
            },

            openView: function(id) {
                var url = "/karta/projekt/" + id;
                url !== $location.path() ? $location.path(url) : (this.panel.navigationActive = "", this.panel.viewVisible = true)
            },
            closeView: function() {
                this.panel.viewActive = false;
                $location.path("/karta/");
            },
            openProject: function(id) {
                $location.path("/karta/projekt/" + id);
                this.panel.navigationActive = "";
            },
            logo:"聚贸·国家馆 JUMORE•National Pavilion",
            pavilions: {
                national:"国家馆",
                provincial: "省馆",
                brand: "品牌馆"
            },
            panel: {
                navigationActive: "",
                viewActive: false,
                viewVisible: false,
                mobilePopupItems: []
            },
            elements: {
                navigationBar: true,//false,
                backToStart: false,
                mobilePopup: false,
                scrollHelp: {
                    visible: false,
                    show: true
                }
            },
            filter: {
                selected: {
                    countries: {},
                    themes: {}
                },
                themes: [{
                    theme_id: 4,
                    name: "Hållbar försörjning"
                }, {
                    theme_id: 5,
                    name: "Mänskliga rättigheter"
                }, {
                    theme_id: 6,
                    name: "Rätten till hälsa"
                }, {
                    theme_id: 7,
                    name: "Tro och lärande"
                }, {
                    theme_id: 8,
                    name: "Katastrof"
                }]
            },
            states: {
                isScrollable: !1,
                isFiltered: !1,
                isFiltering: !1,
                isInit: false,
                isTouch: !1,
                isMobileNav: !1,
                isScrollhelpShowed: !1,
                isBreakpoint: ""
            },
            window: {
                width: 0,
                height: 0
            },
            language:"CN"
        }
    }

    angular
        .module('app.core')
        .factory("RemoteCallService", function() {
            return {
                get: function(req) {
                    if ("undefined" == typeof req.type && (req.type = "GET"), req.xhrFields = {
                            withCredentials: false
                        }, jQuery.support.cors = true, window.XDomainRequest) {
                        var defer = new jQuery.Deferred;
                        defer.done(req.success), defer.fail(req.error);
                        var xdomainReq = new XDomainRequest,
                            param = "";
                        return req.data && (param = "?" + jQuery.param(req.data)), xdomainReq.onprogress = function() {}, xdomainReq.onload = function() {
                            defer.resolve("application/json" === xdomainReq.contentType ? jQuery.parseJSON(xdomainReq.responseText) : xdomainReq.responseText)
                        }, xdomainReq.onerror = function() {
                            defer.reject(xdomainReq)
                        }, xdomainReq.open(req.type, req.url + param), xdomainReq.send(), defer
                    }
                    return jQuery.ajax(req)
                }
            }
        })

    angular
        .module('app.core')
        .factory("GetProjectsService", ["RemoteCallService", function(RemoteCallService) {
            return {
                get: function(params, callback) {

                    return RemoteCallService.get({
                        // type: "GET",
                        url: "mocks/pavilionEntryList.json",
                        // type: "POST",
                        // url: "/gjgQuery.do?action=queryMallTrmplate&"+jQuery.param(params),
                        crossDomain: true,
                        dataType: "json",
                        success: function(response) {
                            var pavilionEntryList = response.pavilionEntryList;
                            for (var projects = [], i = 0; i < pavilionEntryList.length; i++) {
                                var project = {};
                                project.id = pavilionEntryList[i].id;

                                project.country_name = pavilionEntryList[i].name;
                                project.short_country_name = pavilionEntryList[i].shortName;
                                project.forginName = pavilionEntryList[i].otherName;
                                project.short_forginName = pavilionEntryList[i].otherShortName;
                                project.nationalFlag = pavilionEntryList[i].flagUrl;

                                project.lat = pavilionEntryList[i].geoCoord[1];
                                project.lon = pavilionEntryList[i].geoCoord[0];
                                project.has_position = null !== project.lon && null !== project.lat;
                                project.project_number = project.id+"";
                                project.link = pavilionEntryList[i].link;
                                project.customImageUrl = pavilionEntryList[i].customImageUrl;

                                projects.push(project)
                            }
                            callback(projects)
                        }
                    })
                }
            }
        }])


})();


