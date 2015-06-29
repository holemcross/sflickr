'use strict';

/* Consts */

/* Controllers */

var sflickrControllers = angular.module('sflickrControllers', []);

/* Header Controllers */
sflickrControllers.controller('HeaderController', ['$scope','$routeParams','$location',
  function($scope, $routeParams, $location) {
      $scope.searchByText = function(str){
        if(str != null || str != ''){
          $location.path('/grid/'+str+'/1');
        }
      }
    }]);

/* Grid Controllers */

sflickrControllers.controller('PhotoGridUsersController', ['$scope','$routeParams', 'PhotoByUser',
  function($scope, $routeParams, PhotoByUser) {

       PhotoByUser.query( {'page' : $routeParams.page_num ? $routeParams.page_num : 1 }, function(photos){

        if( photos.stat == 'ok'){
          // Data Extraction
          $scope.page_num = photos.photos.page;
          $scope.num_pages = photos.photos.pages
          var raw_data_photos = photos.photos.photo;
          $scope.photo_formated_list = [];
          var tempFormatedPhotoObj;
          raw_data_photos.forEach(function (element, index){
            tempFormatedPhotoObj = { 'title' : element.title,
                                      'thumbnail' : convertPhotoObjectToURL(element, 'q'),
                                      'original' : convertPhotoObjectToURL(element, 'o')

            };
            $scope.photo_formated_list.push(tempFormatedPhotoObj);
          });
      } else{
        // Error Handling
      }

      });
      
  }]);

sflickrControllers.controller('PhotoGridSearchController', ['$scope','$routeParams', 'PhotosBySearch', 'PhotoInfo',
  function($scope, $routeParams, PhotosBySearch, PhotoInfo) {
       $scope.images_exist = false;
       PhotosBySearch.query( {
        'text' : $routeParams.query_text ? $routeParams.query_text : '',
        'page' : $routeParams.page_num ? $routeParams.page_num : 1 }, function(photos){
        //$scope.photo = photos.
        
        if( photos.stat == 'ok'){

          // Data Extraction
          $scope.page_num = photos.photos.page;
          $scope.num_pages = photos.photos.pages
          $scope.photo_formated_list = [];

          var tempFormatedPhotoObj;
          var raw_data_photos = photos.photos.photo;
          var tempPhotoInfo;

          if( raw_data_photos.length > 0){
            $scope.images_exist = true;
            // Generate List of Photos for Display
            raw_data_photos.forEach(function (element, index){
             // Fetch Photo Info
             PhotoInfo.query({ 'photo_id' : element.id, 'secret' : element.secret}, function(photoObj){
               if(photoObj.stat == 'ok'){
                 tempFormatedPhotoObj = { 'title' : element.title,
                                         'description' : photoObj.photo.description,
                                         'date' : photoObj.photo.dates.taken,
                                         'username' : photoObj.photo.owner.username,
                                         'realname' : photoObj.photo.owner.realname,
                                         'location' : photoObj.photo.owner.location,
                                         'thumbnail' : convertPhotoObjectToURL(element, 's'),
                                         'original' : convertPhotoObjectToURL(element, 'o')
                 }
                 $scope.photo_formated_list.push(tempFormatedPhotoObj);
               }
             });

             });
          } else{
            
            console.log("images exist false");
          }
          
          // Create Page Navigation and bread crumbs
          var prevPage = '#/grid/' +$routeParams.query_text + '/' + ($scope.page_num -1);
          var nextPage = '#/grid/' +$routeParams.query_text + '/' + ($scope.page_num +1);

          $scope.next_page = nextPage;
          $scope.prev_page = prevPage;

          // Generate image url with Title Pair
      } else{
        // Error Handling
      }

      });
  }]);

/* Carousel Controllers */

sflickrControllers.controller('PhotoCarouselSearchController', ['$scope','$routeParams', 'PhotosBySearch', 'PhotoInfo',
  function($scope, $routeParams, PhotosBySearch, PhotoInfo) {
       
       PhotosBySearch.query( {
        'text' : $routeParams.query_text ? $routeParams.query_text : '',
        'page' : $routeParams.page_num ? $routeParams.page_num : 1 }, function(photos){
        //$scope.photo = photos.
        if( photos.stat == 'ok'){
          // Data Extraction
          $scope.page_num = photos.photos.page;
          $scope.num_pages = photos.photos.pages
          $scope.photo_formated_list = [];

          var tempFormatedPhotoObj;
          var raw_data_photos = photos.photos.photo;
          var tempPhotoInfo;

          // Generate List of Photos for Display
          raw_data_photos.forEach(function (element, index){
            // Fetch Photo Info
            PhotoInfo.query({ 'photo_id' : element.id, 'secret' : element.secret}, function(photoObj){
              if(photoObj.stat == 'ok'){
                tempFormatedPhotoObj = { 'title' : element.title,
                                        'description' : photoObj.photo.description,
                                        'date' : photoObj.photo.dates.taken,
                                        'username' : photoObj.photo.owner.username,
                                        'realname' : photoObj.photo.owner.realname,
                                        'location' : photoObj.photo.owner.location,
                                        'thumbnail' : convertPhotoObjectToURL(element, 's'),
                                        'original' : convertPhotoObjectToURL(element, 'o')
                }
                $scope.photo_formated_list.push(tempFormatedPhotoObj);
              }
            });

            });
          
          // Create Page Navigation and bread crumbs
          var prevPage = '#/photos/' +$routeParams.query_text + '/' + ($scope.page_num -1);
          var nextPage = '#/photos/' +$routeParams.query_text + '/' + ($scope.page_num +1);

          $scope.next_page = nextPage;
          $scope.prev_page = prevPage;

          // Generate image url with Title Pair
      } else{
        // Error Handling
      }

      });
  }]);

/* Helper Functions */

function convertPhotoObjectToURL(photoObj, type){
  return convertToPhotoURL(photoObj.id, 
                            photoObj.server, 
                            photoObj.farm, 
                            photoObj.secret, 
                            type );
};

function convertToPhotoURL(id, serverId, farmId, secret, type){
  // Type is defined as follows
  // s  small square 75x75
  // q  large square 150x150
  // t thumbnail, 100 longest side
  // o original image
  return 'https://farm' + farmId
        + '.staticflickr.com/' + serverId + '/'
        + id + '_' + secret + '_' + type + '.jpg'
};