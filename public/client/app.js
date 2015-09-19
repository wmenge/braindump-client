var module = angular.module('BrainDumpApp', ['ui.router', 'ngResource', 'angular-loading-bar', 'ngAnimate', 'ui.bootstrap', 'textAngular', 'angular-confirm', 'braindump.notebooks', 'braindump.notes', 'braindump.user-configuration']);

module.run(function($http) {
	$http.defaults.withCredentials = true; // allows sending of auth cookie in CORS scenario
});

module.controller('AppController', [ '$scope', '$state', '$location', function($scope, $state, $location) {

}]);