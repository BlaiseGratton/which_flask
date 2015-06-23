'use strict';

app.controller('ImageController', ['$http', '$scope', function($http, $scope){

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

  $scope.getImages = function(){
    $http.get('/api/photos')
      .success(function(data){
        console.log(data);
        $scope.images = data.photos;
      })
      .error(function(err){
        console.log(err.message);
      });
  };
}]);
