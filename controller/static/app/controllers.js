'use strict';

angular.module('shipyard.controllers', ['ngCookies'])
        .controller('HeaderController', function($http, $scope, AuthToken) {
            $scope.template = 'templates/header.html';
            $scope.username = AuthToken.getUsername();
        })
        .controller('MenuController', function($scope, $location, $cookieStore, AuthToken) {
            $scope.template = 'templates/menu.html';
            $scope.isActive = function(path){
                if ($location.path().substr(0, path.length) == path) {
                    return true
                }
                return false
            }
            $scope.isLoggedIn = AuthToken.isLoggedIn();
        })
        .controller('LoginController', function($scope, $cookieStore, $window, Login, AuthToken) {
            $scope.template = 'templates/login.html';
            $scope.login = function() {
                Login.login({username: $scope.username, password: $scope.password}, function(data){
                    AuthToken.save($scope.username, data.auth_token);
                    $window.location.href = '/#/dashboard';
                    $window.location.reload();
                });
            }
        })
        .controller('LogoutController', function($scope, $window, AuthToken) {
            AuthToken.delete();
            $window.location.href = '/#/login';
            $window.location.reload();
        })
        .controller('DashboardController', function($http, $scope, Events, ClusterInfo, AuthToken) {
            $http.defaults.headers.common['X-Access-Token'] = AuthToken.get();
            $scope.template = 'templates/dashboard.html';
            Events.query(function(data){
                $scope.events = data;
            });;
            ClusterInfo.query(function(data){
                $scope.clusterInfo = data;
                drawDashboardCharts(data.reserved_cpus, data.cpus,
                    data.reserved_memory, data.memory);
            });
        })
        .controller('ContainersController', function($scope, Containers) {
            $scope.template = 'templates/containers.html';
            Containers.query(function(data){
                $scope.containers = data;
            });
        })
        .controller('EnginesController', function($scope, Engines) {
            $scope.template = 'templates/engines.html';
            Engines.query(function(data){
                $scope.engines = data;
            });
        })
        .controller('EventsController', function($scope, Events) {
            $scope.template = 'templates/events.html';
            Events.query(function(data){
                $scope.events = data;
            });
        })

