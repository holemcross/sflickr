'use strict';

/* Consts */

/* Controllers */

var sflickrControllers = angular.module('sflickrControllers', []);

sflickrControllers.controller('PhotoGridUsersController', ['$scope','$routeParams', 'PhotoByUser',
  function($scope, $routeParams, PhotoByUser) {
       
      //:query_text/:page_num

       PhotoByUser.query( {'page' : $routeParams.page_num ? $routeParams.page_num : 1 }, function(photos){
        //$scope.photo = photos.
        if( photos.stat == 'ok'){
          // Data Extraction
          $scope.page_num = photos.photos.page;
          $scope.num_pages = photos.photos.pages
          var raw_data_photos = photos.photos.photo;
          $scope.photo_formated_list = [];
          var tempFormatedPhotoObj;
          raw_data_photos.forEach(function (element, index){
            tempFormatedPhotoObj = { 'title' : element.title,
                                      'thumbnail' : convertPhotoObjectToURL(element, 's'),
                                      'original' : convertPhotoObjectToURL(element, 'o')

            };
            $scope.photo_formated_list.push(tempFormatedPhotoObj);
          });

          // Generate image url with Title Pair
      } else{
        // Error Handling
      }

      });
      
  }]);

sflickrControllers.controller('PhotoGridSearchController', ['$scope','$routeParams', 'PhotosBySearch',
  function($scope, $routeParams, PhotosBySearch) {
       
      //:query_text/:page_num

       PhotosBySearch.query( {
        'text' : $routeParams.query_text ? $routeParams.query_text : '',
        'page' : $routeParams.page_num ? $routeParams.page_num : 1 }, function(photos){
        //$scope.photo = photos.
        if( photos.stat == 'ok'){
          // Data Extraction
          $scope.page_num = photos.photos.page;
          $scope.num_pages = photos.photos.pages
          var raw_data_photos = photos.photos.photo;
          $scope.photo_formated_list = [];
          var tempFormatedPhotoObj;

          // Generate List of Photos for Display
          raw_data_photos.forEach(function (element, index){
            tempFormatedPhotoObj = { 'title' : element.title,
                                      'thumbnail' : convertPhotoObjectToURL(element, 's'),
                                      'original' : convertPhotoObjectToURL(element, 'o')

            };
            $scope.photo_formated_list.push(tempFormatedPhotoObj);
          });

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