var module = angular.module('BrainDumpApp', ['ngRoute', 'angular-loading-bar', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'textAngular', 'braindump.notebooks', 'braindump.notes', 'braindump.user-configuration']);

module.run(function($http) {
	$http.defaults.withCredentials = true; // allows sending of auth cookie in CORS scenario
});

module.controller('AppController', [ '$scope', 'NotebookService', 'NoteService', function($scope, NotebookService, NoteService) {

	$scope.search = function() {
		if (NotebookService.selectedNotebook !== null) {
			NoteService.getList(NotebookService.selectedNotebook, $scope.query);
		}
	};

	$scope.createNote = function() {
		if (NotebookService.selectedNotebook !== null) {
			NoteService.createNote(NotebookService.selectedNotebook);
		}
	};

	$scope.createButtonDisabled = function() {
		return (NotebookService.magicNotebook == NotebookService.selectedNotebook);
	};

	$scope.$on('notebooks.select', function(event, book) {
		$scope.query = '';
	});

	$scope.query = '';
}]);

module.controller('NotebookListController', ['$scope', '$modal', '$rootScope', 'NotebookService', function($scope, $modal, $rootScope, NotebookService) {

	$scope.$on('notebooks.load', function(event) {
		$scope.notebooks = NotebookService.notebooks;
	});

	$scope.$on('notebooks.create', function(event, book) {
		$scope.notebooks = NotebookService.notebooks;
	});

	$scope.$on('notes.delete', function(event, book) {
		NotebookService.selectedNotebook.noteCount--;
	});

	$scope.init = function() {
		NotebookService.getList($scope.sortPredicate);
	};

	$scope.selectNotebook = function(book) {
		NotebookService.selectNotebook(book);
	};

	$scope.noteBookIsSelected = function(book) {
		return book == NotebookService.selectedNotebook;
	};

	$scope.showNewNotebookModal = function() {
		$modal.open({
			templateUrl: 'newNotebookModal.html',
			controller: notebookModalInstanceCtrl,
			resolve: {
				book: function() { return { title: '' }; }
			}
		});
	};

	$scope.totalNoteCount = function() {
		return $scope.notebooks.reduce(function(a, b) {
			return a + b.noteCount;
		}, 0);
	};

	// Magic notebook contains all notes
	$scope.magicNotebook = NotebookService.magicNotebook;
	$scope.notebooks = NotebookService.notebooks;
	$scope.sortPredicate = 'title';
}]);

// todo: split into notebookdetailcontroller and notelistcontroller
module.controller('NoteListController', ['$scope', '$modal', '$rootScope', 'NotebookService', 'NoteService', function($scope, $modal, $rootScope, NotebookService, NoteService) {

	$scope.$on('notebooks.select', function(event, book) {
		// Todo: initiative to load notes based on selected notebook should
		// be in the notes controller
		$scope.selectedNotebook = book;
		NoteService.getList(book);
	});

	$scope.$on('notes.load', function(event, search) {
		// Todo: It shouldn't be necesarry to reset this variable on the
		// notes.load event, as Noteservice.notes should be a promise
		$scope.notes = NoteService.notes;
		$scope.search = search;
		
		if ($scope.notes.length > 0) {
			$scope.selectNote($scope.notes[0]);
		}
	});

	$scope.$on('notes.delete', function(event, note) {
		$scope.notes.splice($scope.notes.indexOf(note), 1);
		
		if (NoteService.selectedNote == note) {
			$scope.selectNote($scope.notes[0]);
		}
	});

	$scope.selectNote = function(note) {
		NoteService.selectNote(note);
	};

	$scope.showRenameNotebookModal = function(book) {
		$modal.open({
			templateUrl: 'updateNotebookModal.html',
			controller: notebookModalInstanceCtrl,
			resolve: {
				book: function() { return book; }
			}
		});
	};

	$scope.deleteNotebook = function(notebook) {
		NotebookService.deleteNotebook(notebook);
	};

	$scope.noteIsSelected = function(note) {
		return note == NoteService.selectedNote;
	};

	$scope.selectedNotebook = null;
	$scope.notes = NoteService.notes;

	$scope.search = false;

	$scope.sortPredicate = 'title';
}]);

module.controller('NoteDetailController', ['$scope', '$timeout', 'NotebookService', 'NoteService', function($scope, $timeout, NotebookService, NoteService) {

	// Autosave: http://adamalbrecht.com/2013/10/30/auto-save-your-model-in-angular-js-with-watch-and-debounce/
	var timeout = null;
	var delay = 2;
	var errorDelay = 5;
	
	$scope.$on('notebooks.load', function(event) {
		$scope.notebooks = NotebookService.notebooks;
	});

	$scope.$on('notebooks.select', function(event, book) {
		$scope.note = null;
		$scope.saved = false;
		$scope.noteForm.$setPristine();
	});

	$scope.$on('notes.select', function(event, note) {
		$scope.note = note;
		$scope.noteForm.$setPristine();
		$scope.saved = false;
		$scope.save_error = false;
	});

	$scope.$on('notes.created', function(event, note) {
		$scope.note = note;
		$scope.saved = false;
		$scope.save_error = false;
	});

	$scope.$on('notes.update.success', function(event) {
		$scope.noteForm.$setPristine();
		$scope.saved = true;
		$timeout(function() { $scope.saved = false; }, 1000 * delay);
	});

	$scope.$on('notes.update.error', function(event) {
		//saveInProgress = false; // Todo should be using promises insead of these event hacks
		// http://adamalbrecht.com/2013/10/30/auto-save-your-model-in-angular-js-with-watch-and-debounce/
		$scope.save_error = true;
		$timeout(function() { $scope.save_error = false; }, 1000 * errorDelay);
	});

	$scope.deleteNote = function(note) {
		NoteService.deleteNote(note);
	};

	var save = function() {
		if ($scope.noteForm.$dirty && $scope.noteForm.$valid) {
			saveInProgress = true;
			NoteService.saveNote($scope.note);
		}
	};

	var debounceSave = function(newVal, oldVal) {
		if ($scope.noteForm.$dirty) {
			if (timeout) {
				$timeout.cancel(timeout);
			}
			timeout = $timeout(save, 1000 * delay);  // 1000 = 1 second
		}
	};

	// Watch field changes to implement autosave
	$scope.$watch('note.title', debounceSave);
	$scope.$watch('note.url', debounceSave);
	$scope.$watch('note.content', debounceSave);

	$scope.note = null;
	$scope.notebooks = NotebookService.notebooks;

	// flag is used to show/hide an animated saved indicator
	$scope.saved = false;
	$scope.save_error = false;

}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
var notebookModalInstanceCtrl = function ($scope, $modalInstance, NotebookService, book) {

	$scope.originalNotebook = book;
	$scope.notebook = { title: book.title };

	$scope.create = function () {
		$scope.originalNotebook.title = $scope.notebook.title;
		NotebookService.addNotebook($scope.originalNotebook, function() {
			$modalInstance.close();
		});
	};

	$scope.update = function () {
		$scope.originalNotebook.title = $scope.notebook.title;
		NotebookService.updateNotebook($scope.originalNotebook, function() {
			$modalInstance.close();
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

};

module.controller('UserConfigurationController', ['$scope', '$modal', 'UserConfigurationService', 'NotebookService', function($scope, $modal, UserConfigurationService, NotebookService) {

	$scope.showUserConfigurationModal = function(configuration) {

		UserConfigurationService.getConfiguration(function () {

			$scope.configuration = UserConfigurationService.configuration;

			$modal.open({
				templateUrl: 'userConfigurationModal.html',
				controller: userConfigurationModalInstanceCtrl,
				resolve: {
					configuration: function() { return $scope.configuration; }
				}
			});

		});
	};

	$scope.configuration = null;
}]);

var userConfigurationModalInstanceCtrl = function ($scope, $modalInstance, UserConfigurationService, NotebookService, configuration) {

	$scope.save = function () {
		UserConfigurationService.updateConfiguration($scope.configuration, function() {
			$modalInstance.close();
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.notebooks = NotebookService.notebooks;
	$scope.configuration = configuration;
	
};