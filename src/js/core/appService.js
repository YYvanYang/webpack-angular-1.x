(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('AppService', appService);

    appService.$inject = ['$location', '$timeout', '$window'];

    function appService($location, $timeout, $window) {
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
            }
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
        .factory("GetProjectOfTheMonthService", ["RemoteCallService", function(RemoteCallService) {
            return {
                get: function(formatDate, callback) {
                    RemoteCallService.get({
                        url: "mocks/manadensProjekt.json",
                        type: "GET",
                        crossDomain: true,
                        dataType: "json",
                        success: function(response) {
                            for (var project = {}, i = 0; i < response.value.length; i++) project.id = response.value[i].insamlingsprojektID;
                            callback(project)
                        },
                        error: function() {
                            var project = {};
                            callback(project.id = 0)
                        }
                    })
                }
            }
        }])

    angular
        .module('app.core')
        .factory("GetProjectService", ["RemoteCallService", function(RemoteCallService) {
            return {
                get: function(slug, callback) {
                    RemoteCallService.get({
                        url: "mocks/projektkartanprojekt.json",
                        type: "GET",
                        crossDomain: !0,
                        dataType: "json",
                        success: function(a) {
                            for (var project = {}, d = 0; d < a.value.length; d++) {
                                project.id = a.value[d].insamlingsprojektID, project.title = a.value[d].rubrik, project.type_id = a.value[d].projekttyp.projekttypID, project.type_name = a.value[d].projekttyp.namn, project.country_id = a.value[d].land.landID, project.country_name = a.value[d].land.namn, project.theme = a.value[d].tema.namn, project.theme_id = a.value[d].tema.temaID, project.city = a.value[d].ort, project.lat = a.value[d].latitud, project.lon = a.value[d].longitud, project.has_position = 0 == project.lon && 0 == project.lat, project.project_number = a.value[d].projektkod;
                                var e = a.value[d].insamlingsmal;
                                project.fund_goal = e.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 "), project.slug = a.value[d].slug, project.video = a.value[d].filmUrl, project.text = a.value[d].ingress, project.text_extended = a.value[d].beskrivning, project.link = a.value[d].projektsidaUrl, project.keywords = new Array;
                                for (var f = 0; f < a.value[d].insamlingsprojektNyckelord.length; f++) project.keywords.push(a.value[d].insamlingsprojektNyckelord[f].nyckelord.namn)
                            }
                            callback(project)
                        }
                    })
                }
            }
        }])

    angular
        .module('app.core')
        .factory("GetProjectsService", ["RemoteCallService", function(RemoteCallService) {
            return {
                get: function(id, callback) {
                    RemoteCallService.get({
                        type: "GET",
                        url: "mocks/projektkartanprojekts.json",
                        crossDomain: true,
                        dataType: "json",
                        success: function(response) {
                            for (var arr = [], i = 0; i < response.value.length; i++) {
                                var project = {};
                                project.id = response.value[i].insamlingsprojektID;
                                project.projectOfTheMonth = project.id === id;
                                project.title = response.value[i].rubrik;
                                project.type_id = response.value[i].projekttyp.projekttypID;
                                project.type_name = response.value[i].projekttyp.namn;
                                project.country_id = response.value[i].land.landID;
                                project.country_name = response.value[i].land.namn;
                                project.theme = response.value[i].tema.namn;
                                project.theme_id = response.value[i].tema.temaID;
                                project.city = response.value[i].ort;
                                project.lat = response.value[i].latitud;
                                project.lon = response.value[i].longitud;
                                project.has_position = null !== project.lon && null !== project.lat;
                                project.project_number = response.value[i].projektkod;
                                project.video = response.value[i].filmUrl;
                                project.slug = response.value[i].slug;
                                project.image_query = response.value[i].bildApiSearchQueryUrl;
                                project.keywords = [];
                                for (var j = 0; j < response.value[i].insamlingsprojektNyckelord.length; j++) project.keywords.push(response.value[i].insamlingsprojektNyckelord[j].nyckelord.namn);
                                arr.push(project)
                            }
                            callback(arr)
                        }
                    })
                }
            }
        }])

})();


