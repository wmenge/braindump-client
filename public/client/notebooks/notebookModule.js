var notebooksModule = angular.module('braindump.notebooks', ['BrainDumpApp.config', 'ngResource']);

// Notebooks Resource service
notebooksModule.factory('Notebooks', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(
        API_URL + '/api/notebooks/:id',
        { id: '@id' },
        { update: { method: 'PUT' } });
}]);

//Notebooks states
notebooksModule.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    .state('notebooks', {
      url: "/notebooks",
      templateUrl: "notebooks/notebookList.html",
      controller: "NotebookListController",
      data: {
        sort: 'title'
      },
      resolve: {
        notebooks: ['Notebooks', function(Notebooks) {
          return Notebooks.query(this.data).$promise;
        }]
      }
    });

});

// Notebook controller
notebooksModule.controller('NotebookListController', ['$scope', 'notebooks', '$state', '$modal', '$filter', function($scope, notebooks, $state, $modal, $filter) {

    $scope.notebooks = notebooks;

    $scope.totalNoteCount = function() {
        return $scope.notebooks.reduce(function(a, b) {
            return a + b.noteCount;
        }, 0);
    };

    $scope.showNewNotebookModal = function() {
        $modal.open({
            templateUrl: 'notebooks/newNotebookModal.html',
            controller: 'NotebooksModalController',
            scope: $scope,
            resolve: {
                book: function() { return { title: '' }; }
            }
        });
    };

    $scope.showUpdateNotebookModal = function(book) {
        $modal.open({
            templateUrl: 'notebooks/updateNotebookModal.html',
            controller: 'NotebooksModalController',
            scope: $scope,
            resolve: {
                book: function() { return book; }
            }
        });
    };

    $scope.deleteNotebook = function(book) {
        
        book.$delete(book, function() {
            // Remove from view
            $scope.notebooks.splice($scope.notebooks.indexOf(book), 1);

            // Navigate away
            $state.go('notebooks.allnotes');
        });
    };

    $scope.$on('note.create', function(event, note) {
        selectedNotebook = $filter('filter')($scope.notebooks, {id: note.notebook_id})[0];
        
        if (selectedNotebook) {
            selectedNotebook.noteCount++;
        }
    });

    $scope.$on('note.delete', function(event, note) {
        selectedNotebook = $filter('filter')($scope.notebooks, {id: note.notebook_id})[0];
        
        if (selectedNotebook) {
            selectedNotebook.noteCount--;
        }
    });


}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
notebooksModule.controller('NotebooksModalController', ['$scope', '$modalInstance', '$state', 'Notebooks', 'book', function($scope, $modalInstance, $state, Notebooks, book) {

    $scope.notebook = angular.copy(book);
    $scope.originalnotebook = book;

    $scope.create = function () {

        Notebooks.save($scope.notebook, function(newBook) {

            $modalInstance.close();
            
            // Modal inherits scope from NotebookListController
            // add server version of notebook to list
            $scope.notebooks.push(newBook);

            // Navigate to new book
            $state.go('notebooks.notes', { notebookId: newBook.id });
        });
    };

    $scope.update = function () {
        $scope.notebook.$update(function() {
            $scope.originalnotebook.title = $scope.notebook.title;
            $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

