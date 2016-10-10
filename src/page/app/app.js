(function () {
    'use strict';

    angular.module('jm-np.app')
        .controller('AppCtrl', ["$scope", "$rootScope", "$routeParams", "$http", "$q", "$location", "$filter", "$timeout", "AppService",
            //"RemoteCallService",
            "GetProjectsService",
            "GetProjectOfTheMonthService",
            // "GetThemes", "GetCountry",
            function($scope, $rootScope, $routeParams, $http, $q, $location, $filter, $timeout, AppService
                //, RemoteCallService
                     , GetProjectsService
                     , GetProjectOfTheMonthService
            ) {
            $scope.app = AppService;
            $scope.listType = "thumbnails";
            $scope.searchedItems = [];
            $scope.mobilePopupItems = [];
            $scope.search = {
                mobile: ""
            };
            var date = new Date,
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                formatDate = "";
            10 >= day && (day = 10 > day ? "0" + day : day),
            10 >= month && (month = 10 > month ? "0" + month : month),
                formatDate = year + "-" + month + "-" + day,
                $rootScope.projectsData = [];
                $rootScope.projectsImages = [];
                GetProjectOfTheMonthService.get(formatDate, function(project) {
                    GetProjectsService.get(project.id, function(data) {
                        $rootScope.projectsData = data;
                        $rootScope.filterData = data;
                        $scope.searchedItems = data;
                        $scope.broadcastData = function() {
                            $rootScope.$broadcast("dataBroadcast");
                            $scope.app.states.isInit = true
                        };
                        $http({
                            method: "GET",
                            url: "/project_images/index.json",
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            }
                        }).success(function(data) {
                            $rootScope.projectsImages = data, $timeout(function() {
                                $scope.broadcastData()
                            }, 1000)
                        }).error(function() {
                            $timeout(function() {
                                $scope.broadcastData()
                            }, 1000)
                        })
                    })
                });

            // $scope.click = function() {
            //     $scope.panel.active = ""
            // };
            // $scope.goTo = function(path) {
            //     $location.path(path), $scope.app.states.isScrollable = !1
            // };
            // $scope.closeKeyboard = function() {
            //     angular.element(".input-search").blur()
            // };
            // $scope.shareFacebook = function() {
            //     FB.ui({
            //         method: "feed",
            //         link: "http://projektkartan.svenskakyrkan.se",
            //         caption: "Svenska kyrkan - Internationellt arbete",
            //         description: "Vi tror på människan. Var med och förändra liv.",
            //         picture: "http://projektkartan.svenskakyrkan.se/assets/project_images/P173_0_420.jpg"
            //     }, function() {})
            // };
            // $scope.shareTwitter = function() {
            //     var a = "http://projektkartan.svenskakyrkan.se",
            //         b = "Vi tror på människan. Var med och förändra liv.";
            //     window.open("http://twitter.com/share?url=" + encodeURIComponent(a) + "&text=" + encodeURIComponent(b) + "&count=horiztonal", "sharer", "toolbar=0,status=0,width=600,height=400,left=" + (screen.availWidth / 2 - 300) + ",top=" + (screen.availHeight / 2 - 200))
            // };
            // $scope.shareGooglePlus = function() {
            //     var a = "http://projektkartan.svenskakyrkan.se";
            //     window.open("https://plusone.google.com/_/+1/confirm?hl=en&url=" + encodeURIComponent(a), "gplusshare", "width=450,height=300,left=" + (screen.availWidth / 2 - 225) + ",top=" + (screen.availHeight / 2 - 150))
            // };
            // "mobile" === $scope.app.states.isBreakpoint && $scope.$watch("search.mobile", function(c) {
            //     $scope.searchedItems = "" !== c ? $filter("filter")($rootScope.projectsData, $scope.search.mobile) : $rootScope.projectsData
            // })
        }]);

})();