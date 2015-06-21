'use strict';
var app = angular.module('whichApp', ['LocalStorageModule', 'base64']);

app.controller('AuthController', function($http, $scope, localStorageService){
  
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
});

app.controller('ImageController', function($http, $base64, $scope){

  var request = {};
  
  function convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat || 'image/png');
        request.image = dataURL;
        callback(request);
        canvas = null; 
    };
    img.src = url;
  }

  var postImage = function(request){
    $http.post('/api/photos', request)
      .success(function(data){
        console.log(data);
      })
      .error(function(err){
        console.log(err);
      });
  }
  
  $scope.submitImage = function(){
    convertImgToBase64URL($scope.url, function(request){
      postImage(request);
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
