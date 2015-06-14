'use strict';
var app = angular.module('whichApp', []);

app.controller('LoginController', function($http, $scope){
  
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
        console.log("User successfully logged in", data);
      })
      .error(function(err){
        console.log(err.message);
      });
  };
});
