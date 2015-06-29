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
      };
      
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

    // CONST
    $scope.sizeChoices = [  {'name' : 'square', 'value' : 'url_sq'},
                              {'name' : 'small', 'value' : 'url_s'},
                              {'name' : 'medium', 'value' : 'url_m'},
                              {'name' : 'large', 'value' : 'url_l'},
                              {'name' : 'original', 'value' : 'url_o'}
                            ];

    // Carousel Functions
    $scope.show_carousel = function(photoObj){
      $scope.carousel_active = true;
      $scope.carousel_photo = photoObj;
      $scope.update_size_pref($scope.image_size);

    };
    $scope.hide_carousel = function(){
      $scope.carousel_active = false;
    };

    $scope.carousel_cycle_next = function(){
      console.log("carousel_cycle_next!");
      console.log($scope.carousel_photo.index);
      if($scope.carousel_photo.index >= $scope.photo_formated_list.length-1){
        // Check if new page exists
        
        if($scope.page_num < $scope.num_pages){
          // Load New Page
          $scope.query_search( $routeParams.query_text,$scope.page_num+1);
          $scope.show_carousel($scope.photo_formated_list[0]);
        }
      }else{
        // Cycle Photo
        $scope.show_carousel($scope.photo_formated_list[$scope.carousel_photo.index+1]);
      }
    };

    $scope.carousel_cycle_prev = function(){
      console.log($scope.carousel_photo.index);
      if($scope.carousel_photo.index <= 0){
        // Check if new page exists
        if($scope.page_num > 1){
          // Load New Page
          $scope.query_search( $routeParams.query_text,$scope.page_num-1);
          $scope.show_carousel($scope.photo_formated_list[$scope.photo_formated_list.length-1]);
        }
      }else{
        // Cycle Photo
        $scope.show_carousel($scope.photo_formated_list[$scope.carousel_photo.index-1]);
      }
    };

    $scope.update_size_pref = function(image_size){
      console.log(image_size);
      var url = $scope.carousel_photo.url_sq;
      if(image_size != null && image_size != undefined){
        
        switch(image_size.value){
          case 'url_sq':
            url = $scope.carousel_photo.url_sq;
            break;
          case 'url_s':
            url = $scope.carousel_photo.url_s;
            break;
          case 'url_m':
            url = $scope.carousel_photo.url_m;
            break;
          case 'url_l':
            url = $scope.carousel_photo.url_l;
            break;
          case 'url_o':
            url = $scope.carousel_photo.url_o;
            break;
        }
        $scope.carousel_photo.url = url;
        console.log(url);
        console.log($scope.carousel_photo.url );
      }
      

      
    }

    $scope.query_search = function( qtext, pageNum){
      $scope.images_exist = false;
       PhotosBySearch.query( {
        'text' : qtext ? qtext : '',
        'page' : pageNum ? pageNum : 1 }, function(photos){
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
              
              tempFormatedPhotoObj = { 'title' : element.title,
                                        'date_taken' : element.datetaken,        
                                        'username' : element.ownername,
                                        //'geo' : x, // Hiding due to uncommon use
                                        'description' : element.description._content,
                                        //'license' : element.license, // Hiding due to extra data for pairing
                                        'url_sq' : element.url_sq,
                                        'url_s' : element.url_s,
                                        'url_q' : element.url_q,
                                        'url_m' : element.url_m,
                                        'url_l' : element.url_l,
                                        'url_o' : element.url_o,
                                        'url' : element.url_sq,
                                        'index' : index
                                    };

              $scope.photo_formated_list.push(tempFormatedPhotoObj);
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
    }
  
      // Run controller Once
      $scope.query_search($routeParams.query_text, $routeParams.page_num);
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