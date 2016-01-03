
angular.module('nb.blog', ['hc.commonmark'])
  .service('nbBlogDataService', function ($http) {
    DataService = this;
    
    DataService.get_posts = function (page) {
      return $http.get('/blog/data/page-' + page + '.json');
    };
    
    DataService.get_post = function (path) {
      return $http.get('/blog/posts/' + path + '.md');
    };
    
    DataService.get_page = function (slug) {
      return $http.get('/pages/' + slug + '.md');
    };
    
    DataService.parse_post = function (body) {
      var c;
      var content = '';
      var opens = 0;
      var metadata = null;
      
      for (var i=0; i < body.length; i++) {
        c = body.charAt(i);
        content = content + c;
        
        if (c == '{' && !metadata) {
          if (opens === 0) {
            content = c;
          }
          
          opens = opens + 1;
        }
        
        else if (c == '}') {
          opens = opens - 1;
          
          if (opens === 0) {
            try {
              metadata = JSON.parse(content);
            }
            
            catch (error) {
              metadata = {};
            }
            content = '';
          }
        }
      }
      
      return {metadata: metadata, content: content};
    };
    
    return DataService;
  })
  
  .controller('nbBlogListController', function ($scope, $location, nbBlogDataService) {
    var search = $location.search();
    
    $scope.page = parseInt(search.page || 1);
    $scope.set_title();
    
    $scope.load_posts = function (response) {
      $scope.posts = response.data.posts;
      $scope.total_pages = response.data.total_pages;
      
      if ($scope.page > 1) {
        $scope.page_prev = $scope.page - 1;
      }
      
      if ($scope.page < $scope.total_pages) {
        $scope.page_next = $scope.page + 1;
      }
    };
    
    nbBlogDataService.get_posts($scope.page).then(
      $scope.load_posts,
      function () {
        $scope.show_error('Error loading blog posts.');
      }
    );
  })

  .controller('nbBlogPostController', function ($scope, $routeParams, nbBlogDataService) {
    var path = $routeParams.year + '/' + $routeParams.slug;
    
    $scope.load_post = function (response) {
      $scope.post = nbBlogDataService.parse_post(response.data);
      $scope.set_title($scope.post.metadata.title);
    };
    
    nbBlogDataService.get_post(path).then(
      $scope.load_post,
      function () {
        $scope.show_error('Error loading blog post.');
      }
    );
  })
  
  .controller('nbPageController', function ($scope, $routeParams, nbBlogDataService) {
    $scope.load_page = function (response) {
      $scope.page = nbBlogDataService.parse_post(response.data);
      $scope.set_title($scope.page.metadata.title);
    };
    
    nbBlogDataService.get_page($routeParams.slug).then(
      $scope.load_page,
      function () {
        $scope.show_error('Error loading page.');
      }
    );
  });