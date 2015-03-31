var userConfigurationModule = angular.module('braindump.user-configuration', ['BrainDumpApp.config', 'ngResource']);

userConfigurationModule.factory('UserConfiguration', ['$resource', 'API_URL', function($resource, API_URL) {
	return $resource(
		API_URL + '/api/configuration',
		{ id: '@id' },
		{ update: { method: 'PUT' } });
}]);

userConfigurationModule.service( 'UserConfigurationService', [ '$rootScope', 'UserConfiguration', function($rootScope, UserConfiguration) {

	var service = {
		configuration: null,
		getConfiguration: function (success) {
			service.configuration = UserConfiguration.get(function() {
				success();
			});
		},
		updateConfiguration: function(configuration, success) {
			newConfiguration = new UserConfiguration(configuration);
			newConfiguration.$update(function() {
				success();
			});
		}
	};

   return service;
   
}]);