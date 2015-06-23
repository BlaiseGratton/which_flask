'use strict';

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
