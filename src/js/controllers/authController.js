'use strict';

app.controller('AuthController', ['$http', '$scope', 'localStorageService', function($http, $scope, localStorageService){
  
  $scope.registerUser = function() {
    $http.post("/api/users", $scope.register)
      .success(function(data){
        localStorageService.set('token', data.token);
        console.log("User successfully registered", data);
      })
      .error(function(err){
        console.log(err.message);
      });
  };

  $scope.loginUser = function() {
    $http.post("/api/login", $scope.login)
      .success(function(data){
        localStorageService.set('token', data.token);
        console.log("User successfully logged in", data);
      })
      .error(function(err){
        console.log(err.message);
      });
  };

  $scope.getUser = function() {
    $http.get("/api/user")
      .success(function(data){
        console.log(data);
      })
      .error(function(err){
        console.log(err.message);
      });
  };

  $scope.logoutUser = function() {
    $http.get("/api/logout")
      .success(function(data){
        localStorageService.remove('token');
        console.log("User successfully logged out");
      })
      .error(function(err){
        console.log(err.message);
      });
  };
}]);
