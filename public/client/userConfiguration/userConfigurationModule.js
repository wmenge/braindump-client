var userConfigurationModule = angular.module('braindump.user-configuration', ['BrainDumpApp.config', 'ngResource']);

userConfigurationModule.factory('UserConfiguration', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(
        API_URL + '/api/configuration',
        { id: '@id' },
        { update: { method: 'PUT' } });
}]);
/*
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
*/
userConfigurationModule.controller('UserConfigurationController', ['$scope', '$modal', 'UserConfiguration', 'Notebooks', function($scope, $modal, UserConfiguration, Notebooks) {

    $scope.showUserConfigurationModal = function(configuration) {

    $modal.open({
            templateUrl: 'userConfiguration/updateUserConfigurationModal.html',
            controller: 'userConfigurationModalController',
            resolve: {
                configuration: ['UserConfiguration', function(UserConfiguration) {
                    return UserConfiguration.get();
                }],
                notebooks: ['Notebooks', function(Notebooks) {
                    return Notebooks.query(this.data).$promise;
                }]
            }
        });
    };
}]);

userConfigurationModule.controller('userConfigurationModalController', ['$scope', '$modalInstance', 'configuration', 'notebooks', function($scope, $modalInstance, configuration, notebooks) {

    $scope.configuration = configuration;
    $scope.notebooks = notebooks;

    $scope.save = function () {
        $scope.configuration.$update(function() {
            $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);