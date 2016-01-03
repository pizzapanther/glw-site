function tpl (path) {
  return 'templates/' + path;
}

function img (path) {
  return 'img/' + path;
}

var glwapp = angular.module('GlwApp', ['nb.blog', 'ngRoute', 'angularMoment']);

glwapp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  
  $routeProvider
    .when('/',
      {controller:'nbBlogListController', templateUrl: tpl('list.html')})
    .when('/blog/post/:year/:slug',
      {controller:'nbBlogPostController', templateUrl: tpl('post.html')});
      
});

glwapp.run(function ($rootScope) {
  
});

glwapp.controller('GlobalController', function ($scope) {
  $scope.tpl = tpl;
  $scope.img = img;
  var title = "God So Loved The World Ministries, Inc";
  
  $scope.set_title = function (t) {
    if (t) {
      $scope.title = t + " | " + title;
    }
    
    else {
      $scope.title = title;
    }
  };
  
  $scope.show_error = function (message, event) {
    alert(message);
  };
  
  $scope.set_title();
});
