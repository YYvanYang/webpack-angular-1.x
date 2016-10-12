(function () {
    'use strict';

    angular.module('jm-np.project')
        .controller("ProjectCtrl", ["$scope", "$window", "$filter", "$q", "$rootScope", "$location", "$timeout", "$sce", "$routeParams", "AppService", "GetProjectService", //"GetImagesService",
            function($scope, $window, $filter, $q, $rootScope, $location, $timeout, $sce, $routeParams, AppService, GetProjectService) {
        $scope.projectData = [];
        $scope.app = AppService;
        $scope.currentImage = {
            page: 0
        };
        $scope.projectLoaded = false;
        $scope.sliderLoaded = false;
        $scope.extendedText = false;
        $scope.similarProjects = [];
        $scope.images = [];
        $scope.imageStatus = function(url) {
            var _ajax = angular.element.ajax({
                type: "HEAD",
                url: url,
                async: false
            });
            return _ajax.status
        };
        $scope.extendText = function(extend) {
            var _$extended = angular.element("body").find(".extended");
            extend ? (_$extended.slideDown(), $scope.extendedText = true) : (_$extended.slideUp(), $scope.extendedText = false)
        };
        GetProjectService.get($routeParams.slug, function(project) {
            $scope.projectData = project;
            var projectsImages = $rootScope.projectsImages[$scope.projectData.project_number];
            angular.forEach(projectsImages, function(val, key) {
                var image = {};
                image.description = projectsImages[key].image_text, image.photographer = projectsImages[key].photographer, image.url = "project_images/" + $scope.projectData.project_number + "_" + key + "_420.jpg", $scope.images.push(image)
            }), $timeout(function() {
                $scope.projectLoaded = true
            }, 0), $timeout(function() {
                var _$royalSlider = angular.element("body").find(".royalSlider").data("royalSlider");
                void 0 !== _$royalSlider && (angular.element("body").find(".btn-info").on("click", function() {
                    var _$description = angular.element("body").find(".rsActiveSlide>div>.description");
                    _$description.hasClass("is-active") ? _$description.removeClass("is-active") : _$description.addClass("is-active")
                }), angular.element("body").on("click", ".royalSlider .btn-close", function() {
                    angular.element("body").find(".royalSlider .description").removeClass("is-active")
                }), _$royalSlider.ev.on("rsAfterSlideChange", function() {
                    angular.element("body").find(".royalSlider .description").removeClass("is-active")
                }))
            }, 1000), $scope.similarProject()
        });
        $scope.shareFacebook = function() {
            FB.ui({
                method: "feed",
                link: location.href,
                caption: "Svenska kyrkan - Internationellt arbete",
                description: $scope.projectData.title + ", " + $scope.projectData.country_name,
                picture: "http://projektkartan.svenskakyrkan.se/project_images/" + $scope.projectData.project_number + "_0_420.jpg"
            }, function() {})
        };
        $scope.shareTwitter = function() {
            var url = location.href,
                text = "Svenska kyrkans Internationella arbete - " + $scope.projectData.title + ", " + $scope.projectData.country_name;
            window.open("http://twitter.com/share?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text) + "&count=horiztonal", "sharer", "toolbar=0,status=0,width=600,height=400,left=" + (screen.availWidth / 2 - 300) + ",top=" + (screen.availHeight / 2 - 200))
        };
        $scope.goToSlide = function(page) {
            $scope.currentImage.page = page
        };
        $scope.trackEvent = function(a, c, d) {
            //$window.ga("send", "event", a, c, d)
        };
        $scope.similarProject = function() {
            for (var index = $rootScope.projectsData.length - 1; index >= 0; index--) $scope.projectData.theme_id === $rootScope.projectsData[index].theme_id && $rootScope.projectsData[index].id !== $scope.projectData.id && $scope.similarProjects.push($rootScope.projectsData[index]);
            $scope.similarProjects.sort(function() {
                return Math.random() - .5
            })
        };
        $scope.$on("$viewContentLoaded", function() {})
    }])

})();