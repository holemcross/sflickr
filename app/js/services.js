'use strict';

/* Consts */
var api_key = "e405d56745dd67037118ea9fd6689791";
var rest_uri = "https://api.flickr.com/services/rest/";
/* Services */

var sflickrServices = angular.module('sflickrServices',['ngResource']);

sflickrServices.factory('PhotoByUser', ['$resource',
	function($resource){
		var default_user = '23400116@N05';
		//var default_user = '@user_id';
		var params = { 	 'method' : 'flickr.people.getPublicPhotos',
						 'api_key': api_key,
						 'user_id' : default_user, 
						 'safe_search' : 0,
						 'extras' : null,
						 'per_page' : 24,
						 'page' : '@page_num',
						 'format' : 'json',
						 'nojsoncallback' : 1
						};
		var actions = { 'query': { 'method' : 'GET', 'params': params, 'isArray': false}};
		return $resource(rest_uri, {}, actions,{'stripTrailingSlashes' : false});
	}]);

sflickrServices.factory('PhotosBySearch', ['$resource',
	function($resource){
		var default_text = 'bird';
		//var default_user = '@user_id';
		var params = { 	 'method' : 'flickr.photos.search',
						 'api_key': api_key,
						 'text' : '@query_text', 
						 'safe_search' : 0,
						 'privacy_filter' : 1,
						 'content_type' : 1, // Photos only
						 'per_page' : 24,
						 'page' : '@page_num',
						 'format' : 'json',
						 'nojsoncallback' : 1
						};
		var actions = { 'query': { 'method' : 'GET', 'params': params, 'isArray': false}};
		return $resource(rest_uri, {}, actions,{'stripTrailingSlashes' : false});
	}]);

sflickrServices.factory('PhotoInfo', ['$resource',
	function($resource){
		var params = { 	 'method' : 'flickr.photos.getInfo',
						 'api_key': api_key,
						 'photo_id' : '@pid', 
						 'secret' : '@photo_secret',
						 'format' : 'json',
						 'nojsoncallback' : 1
						};
		var actions = { 'query': { 'method' : 'GET', 'params': params, 'isArray': false}};
		return $resource(rest_uri, {}, actions,{'stripTrailingSlashes' : false});
	}]);
