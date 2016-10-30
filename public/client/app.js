var module = angular.module('BrainDumpApp', ['ui.router', 'ngResource', 'angular-loading-bar', 'ngAnimate', 'ui.bootstrap', 'ui-notification', 'ngSanitize', 'angular-confirm', 'angularTrix', 'angularMoment', 'ui.event', 'braindump.notebooks', 'braindump.notes', 'braindump.user', 'braindump.user-configuration']);

module.run(function($http) {
	$http.defaults.withCredentials = true; // allows sending of auth cookie in CORS scenario

    // Set locale of moment.js to nl
    module.run(function(amMoment) {
        amMoment.changeLocale('nl');
    });
});

// by default, angular uses some debugging mode (https://code.angularjs.org/1.5.5/docs/guide/production)
// turn it off!
module.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);

module.controller('AppController', [ '$scope', '$state', '$location', function($scope, $state, $location) {

}]);