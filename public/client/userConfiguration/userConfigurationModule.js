var userConfigurationModule = angular.module('braindump.user-configuration', ['BrainDumpApp.config', 'ngResource', 'ui-notification']);

userConfigurationModule.factory('UserConfiguration', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(
        API_URL + '/api/configuration',
        { id: '@id' },
        { update: { method: 'PUT' } });
}]);

userConfigurationModule.controller('UserConfigurationController', ['$scope', '$uibModal', 'User', 'UserConfiguration', 'Notebooks', 'Notification', function($scope, $uibModal, User, UserConfiguration, Notebooks, Notification) {

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

    $scope.showUserPasswordModal = function(configuration) {

        $uibModal.open({
                templateUrl: 'user/updateUserPasswordModal.html',
                controller: 'userPasswordModalController',
                resolve: {
                    user: function() {
                        return $scope.user;
                    }
                }
            });
    };

}]);

userConfigurationModule.controller('userPasswordModalController', ['$scope', '$uibModalInstance', 'user', 'Notification', function($scope, $uibModalInstance, user, Notification) {

    $scope.alerts = [];
    $scope.user = user;
    
    $scope.save = function () {

        $scope.user.$update(
            function() { // success
                Notification.success('Password has been saved');
                $uibModalInstance.close();
            },
            function(response) { // error
                $scope.alerts.push({ type: 'danger', msg: response.data});
            }
        );
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

userConfigurationModule.controller('userConfigurationModalController', ['$scope', '$uibModalInstance', 'user', 'configuration', 'notebooks', function($scope, $uibModalInstance, user, configuration, notebooks) {

    $scope.user = user;
    $scope.configuration = configuration;
    $scope.notebooks = notebooks;

    $scope.save = function () {
        // Todo: Error handling
        $scope.configuration.$update(function() {
            $uibModalInstance.close();
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);