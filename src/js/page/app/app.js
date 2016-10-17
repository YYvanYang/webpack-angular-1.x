(function () {
    'use strict';

    angular.module('jm-np.app')
        .controller('AppCtrl', ["$scope", "$rootScope", "$routeParams", "$http", "$q", "$location", "$filter", "$timeout", "AppService",
            //"RemoteCallService",
            "GetProjectsService",
           // "GetProjectOfTheMonthService",
            "queryMallTrmplate",
            "queryFriendshipLink",
            // "GetThemes", "GetCountry",
            function($scope, $rootScope, $routeParams, $http, $q, $location, $filter, $timeout, AppService
                //, RemoteCallService
                     , GetProjectsService
                    // , GetProjectOfTheMonthService
                     , queryMallTrmplate
                     , queryFriendshipLink
            ) {
                // todo: this should change to $routeParams or $location.path()
                var language = $location.search();
                AppService.language = language.EN ? "EN" : AppService.language;

            $scope.app = AppService;
            $scope.listType = "thumbnails";
            $scope.searchedItems = [];
            $scope.mobilePopupItems = [];
            $scope.search = {
                mobile: ""
            };

            $rootScope.projectsData = [];
                $rootScope.projectsHotData = [];
            $rootScope.projectsImages = [];
                $rootScope.localization = {};
                AppService.localization = {};
                var lanType = 0;// 中文
                $scope.app.language === 'CN' ? lanType = 0 : lanType = 1;
            GetProjectsService.get({lanType: lanType}, function(data) {
                $rootScope.projectsData = data;
                //$rootScope.projectsHotData = data;
                $rootScope.filterData = data;
                $scope.searchedItems = data;
                $scope.broadcastData = function() {
                    $rootScope.$broadcast("dataBroadcast");
                    $scope.app.states.isInit = true
                };

                var promise = $http({
                    method: "GET",
                    url: "localization/language.json",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).success(function(data) {
                    $rootScope.localization = data.localization;
                    AppService.localization = data.localization;
                })

                $q.when(promise).then(function () {
                    GetProjectsService.get({lanType: lanType, isHot: 1}, function (data) {
                        // AppService.friendshipLinkList = data.friendshipLinkList;
                        // console.log(AppService.friendshipLinkList)
                        $rootScope.projectsHotData = data;
                    }).always(function () {
                        $timeout(function() {
                            $scope.broadcastData()
                        }, 1000)
                    })
                })

            })


                // queryMallTrmplate.get({lanType: 0}, function (data) {
                //     AppService.pavilionEntryList = data.pavilionEntryList;
                //     console.log(AppService.pavilionEntryList)
                // })
                //
                // queryFriendshipLink.get({positionType: 1}, function (data) {
                //     AppService.friendshipLinkList = data.friendshipLinkList;
                //     console.log(AppService.friendshipLinkList)
                // })

            // $scope.click = function() {
            //     $scope.panel.active = ""
            // };
            // $scope.goTo = function(path) {
            //     $location.path(path), $scope.app.states.isScrollable = !1
            // };
            // $scope.closeKeyboard = function() {
            //     angular.element(".input-search").blur()
            // };
            $scope.shareWeichat = function() {
                window.open('https://wx.qq.com/JUMORE_ECOMMERCE', '_blank');
            };
            $scope.shareTwitter = function() {
                window.open('https://twitter.com/jumoremedia', '_blank');
            };
            $scope.shareWeibo = function() {
                window.open('http://weibo.com/jumore', '_blank');
            };
            // "mobile" === $scope.app.states.isBreakpoint && $scope.$watch("search.mobile", function(c) {
            //     $scope.searchedItems = "" !== c ? $filter("filter")($rootScope.projectsData, $scope.search.mobile) : $rootScope.projectsData
            // })
        }]);

})();