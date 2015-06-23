'use strict';
var app = angular.module('whichApp', ['LocalStorageModule']);

app.config(['localStorageServiceProvider', '$httpProvider', function(localStorageServiceProvider, $httpProvider) {
  localStorageServiceProvider
    .setPrefix('which')
    .setStorageType('sessionStorage')
    .setNotify(true, true);

  $httpProvider.interceptors.push('tokenInjector');
}]);
