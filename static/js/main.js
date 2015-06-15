'use strict';
var app = angular.module('whichApp', ['LocalStorageModule']);

app.controller('AuthController', function($http, $scope, localStorageService){
  
  $scope.registerUser = function() {
    $http.post("/api/users", $scope.register)
      .success(function(data){
        $scope.response = data;
        console.log("User successfully registered", data);
      })
      .error(function(err){
        console.log(err.message);
      });
  };

  $scope.loginUser = function() {
    $http.post("/api/login", $scope.login)
      .success(function(data){
        $scope.response = data;
        localStorageService.set('token', data.token);
        console.log("User successfully logged in", data);
      })
      .error(function(err){
        console.log(err.message);
      });
  };
});

app.factory('tokenInjector', function(localStorageService) {
  var sessionInjector = {
    request: function(config) {
      var token = localStorageService.get('token');
      if (token) {
        config.headers['x-session-token'] = token;
      }
      return config;
    }
  };
  return sessionInjector; 
});

app.config(['localStorageServiceProvider', '$httpProvider', function(localStorageServiceProvider, $httpProvider) {
  localStorageServiceProvider
    .setPrefix('which')
    .setStorageType('sessionStorage')
    .setNotify(true, true);
  
  $httpProvider.interceptors.push('tokenInjector');
}]);
