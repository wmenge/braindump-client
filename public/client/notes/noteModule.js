var notesModules = angular.module('braindump.notes', ['ngResource']);

// Notes services
notesModules.factory('Notes', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(
        API_URL + '/api/notebooks/:notebookId/notes/:noteId',
        { notebookId: '@notebook_id', noteId: '@id' },
        { update: { method: 'PUT' }});
}]);

notesModules.factory('AllNotes', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(API_URL + '/api/notes/:noteId',
        { noteId: '@id' },
        { update: { method: 'PUT' }});
}]);

//Notes states
notesModules.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/allnotes");

  $stateProvider
    .state('notebooks.allnotes', {
      url: "^/allnotes?q&sort",
      views: {
        'noteSearch@': {
          templateUrl: 'notes/noteSearch.html',
          controller: 'NoteSearchController'
        },
        'noteList': {
          templateUrl: 'notes/noteList.html',
          controller: 'NoteListController'
        }
      },
      resolve: {
        notes: ['AllNotes', '$stateParams', function(AllNotes, $stateParams) {
          return AllNotes.query($stateParams).$promise;
        }]
      }
    })
    .state('notebooks.notes', {
      url: "/{notebookId:int}/notes?q&sort",
      views: {
        'noteSearch@': {
          templateUrl: 'notes/noteSearch.html',
          controller: 'NoteSearchController'
        },
        'noteList': {
          templateUrl: 'notes/noteList.html',
          controller: 'NoteListController'
        }
      },
      resolve: {
        notes: ['Notes', '$stateParams', function(Notes, $stateParams) {
          return Notes.query($stateParams).$promise;
        }]
      }
    })
    .state('notebooks.allnotes.detail', {
      url: "/{noteId:int}",
      templateUrl: 'notes/noteDetail.html',
      controller: 'NoteDetailController',
      resolve: {
        note: ['AllNotes', '$stateParams', function(AllNotes, $stateParams) {
          return AllNotes.get($stateParams).$promise;
        }]
      }
    })
    .state('notebooks.notes.detail', {
      url: "/{noteId:int}",
      templateUrl: 'notes/noteDetail.html',
      controller: 'NoteDetailController',
      resolve: {
        note: ['Notes', '$stateParams', function(Notes, $stateParams) {
          return Notes.get($stateParams).$promise;
        }]
      }
    })
    .state('notebooks.notes.create', {
      url: "/new",
      templateUrl: 'notes/noteDetail.html',
      controller: 'NoteDetailController',
      resolve: {
        note: ['Notes', '$stateParams', function(Notes, $stateParams) {
            return new Notes({ notebook_id: $stateParams.notebookId, type: "HTML" });
        }]
      }
    });

});

// Notes controllers
notesModules.controller('NoteSearchController', [ '$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {

    $scope.q = $stateParams.q;

    $scope.search = function() {
        if ($state.includes('*.allnotes.**')) {
            $state.go('notebooks.allnotes', { q: $scope.q });
        } else {
            $state.go('notebooks.notes', { q: $scope.q });
        }
    };

}]);
 
notesModules.controller('NoteListController', ['$scope', 'notes', '$state', '$stateParams', '$filter', function($scope, notes, $state, $stateParams, $filter) {

    if ($stateParams.q) { $scope.search = true; }

    $scope.notes = notes;

    // Get selected notebook from parent scope 
    if ($stateParams.notebookId) {
        $scope.selectedNotebook = $filter('filter')($scope.notebooks, {id: $stateParams.notebookId})[0];
    }

    // Navigate directly to child state, either the first note in the notebook
    // or the create form if there no notes in the notebook
    if (!$state.includes("**.detail") && !$state.includes("**.create")) {
        if (notes.length > 0) {
            // Select first note in notebook
            note = notes[0];
            $state.go('.detail', { notebookId: note.notebook_id, noteId: note.id } );
        } else {
            // Show create form
            $state.go('.create');
        }
    }

    $scope.$on('note.update', function(event, note) {
        var oldNote = $filter('filter')($scope.notes, {id: note.id})[0];
        if (!oldNote) return;
        for (var k in note) oldNote[k] = note[k];
    });

    $scope.$on('note.create', function(event, note) {
        if ($scope.selectedNotebook.id == note.notebook_id) {
            $scope.notes.push(note);
        }
    });

    $scope.$on('note.delete', function(event, note) {
        var listNote = $filter('filter')($scope.notes, {id: note.id})[0];
        $scope.notes.splice($scope.notes.indexOf(listNote), 1);
    });

}]);

notesModules.controller('NoteDetailController', ['$rootScope', '$scope', '$timeout', '$state', 'note', function($rootScope, $scope, $timeout, $state, note) {

    // Autosave: http://adamalbrecht.com/2013/10/30/auto-save-your-model-in-angular-js-with-watch-and-debounce/
    var timeout = null;
    var delay = 2;
    var errorDelay = 5;

    $scope.note = note;
    $scope.formData = angular.copy($scope.note);

    $scope.save = function() {

        if ($scope.noteForm.$dirty && $scope.noteForm.$valid) {

            $scope.note = angular.copy($scope.formData);

            // consider form to be pristine as content has been
            // copied to $scope.note and will be saved
            $scope.noteForm.$setPristine();

            var callback = function(modifiedNote) {
                $scope.note = modifiedNote;

                // user could have edited the form during the
                // REST roundtrip
                if ($scope.noteForm.$pristine) {
                    $scope.formData = angular.copy($scope.note);
                }
            };

            if ($scope.note.id) {
                $scope.note.$update(function(modifiedNote) {  // Existing entry, PUT Request
                    callback(modifiedNote);
                    $rootScope.$broadcast('note.update', modifiedNote);
                });
            } else {
                $scope.note.$save(function(modifiedNote) {   // New entry, POST Request
                    callback(modifiedNote);
                    $rootScope.$broadcast('note.create', modifiedNote);
                });
            }
            
        }
    };

    $scope.delete = function() {

        var callback = function() {
            $scope.note = null;
            $scope.formData = null;
            $scope.noteForm.$setPristine();
            $rootScope.$broadcast('note.delete', note);
            // Navigate back to list, that will lead to navigation
            // to first note in list
            $state.go('^', null, { reload: true });
        };

        if ($scope.note.id === null)
        {
            callback();
        } else {
            $scope.note.$delete(callback);
        }
    };

    var debounceSave = function(newVal, oldVal) {
        if ($scope.noteForm.$dirty && $scope.noteForm.$valid) {
            if (timeout) {
                $timeout.cancel(timeout);
                timeout = null;
            }
            timeout = $timeout($scope.save, 1000 * delay);  // 1000 = 1 second
        }
    };

    // Watch field changes to implement autosave
    // todo: replace with form field debounce (in newer angular version)
    $scope.$watch('formData.title', debounceSave);
    $scope.$watch('formData.url', debounceSave);
    $scope.$watch('formData.content', debounceSave);
    $scope.$watch('formData.notebook_id', $scope.save);

}]);