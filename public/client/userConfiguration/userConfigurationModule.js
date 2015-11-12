var userConfigurationModule = angular.module('braindump.user-configuration', ['BrainDumpApp.config', 'ngResource']);

userConfigurationModule.factory('UserConfiguration', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(
        API_URL + '/api/configuration',
        { id: '@id' },
        { update: { method: 'PUT' } });
}]);

userConfigurationModule.controller('UserConfigurationController', ['$scope', '$uibModal', 'User', 'UserConfiguration', 'Notebooks', function($scope, $uibModal, User, UserConfiguration, Notebooks) {

    $scope.user = User.get();

    $scope.showUserConfigurationModal = function(configuration) {

    $uibModal.open({
            templateUrl: 'userConfiguration/updateUserConfigurationModal.html',
            controller: 'userConfigurationModalController',
            resolve: {
                user: function() {
                    return $scope.user;
                },
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

userConfigurationModule.controller('userConfigurationModalController', ['$scope', '$uibModalInstance', 'user', 'configuration', 'notebooks', function($scope, $uibModalInstance, user, configuration, notebooks) {

    $scope.user = user;
    $scope.configuration = configuration;
    $scope.notebooks = notebooks;

    $scope.save = function () {
        $scope.configuration.$update(function() {
            $uibModalInstance.close();
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);