var userModule = angular.module('braindump.user', ['BrainDumpApp.config', 'ngResource']);

userModule.factory('User', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(
        API_URL + '/api/user',
        { id: '@id' },
        { update: { method: 'PUT' }});
}]);