'use strict';

// Declare app level module which depends on views, and components
var sflickrApp = angular.module('sflickr', [
  'ngRoute',
  'sflickrControllers',
  'sflickrServices'
]).
config(['$routeProvider', function($routeProvider) {

// Routing
$routeProvider.
  //when('/photos', {
  //  templateUrl: 'partials/photo_grid.html',
  //  controller: 'GridController'
  //}).
  //  when('/photos/:page_num', {
  //  templateUrl: 'partials/photo_grid.html',
  //  controller: 'GridController'
  //}).
  when('/grid/:query_text/:page_num', {
    templateUrl: 'partials/photo_grid.html',
    controller: 'PhotoGridSearchController'
  }).
  otherwise({
    redirectTo: '/grid/cats/1'
  });
  $routeProvider.otherwise({redirectTo: '/grid'});
}]);

sflickrApp
  .config(function($httpProvider){
  	$httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    delete $httpProvider.defaults.headers.common['Access-Control-Request-Methods'];
});
