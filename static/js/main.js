'use strict';
var app = angular.module('whichApp', []);

app.controller('LoginController', function($http, $scope){
  
  $scope.registerUser = function() {
    $http.post("/api/users", $scope.user)
      .success(function(data){
        $scope.response = data;
        console.log("User successfully registered", data);
      })
      .error(function(err){
        console.log(err.message);
      });
  };

});
