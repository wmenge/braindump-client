var module = angular.module('BrainDumpApp', ['ngResource', 'ui.bootstrap', 'textAngular', 'braindump.notebooks', 'braindump.notes']);

module.controller('AppController', [ '$scope', '$modal', 'NotebookService', 'NoteService', function($scope, $modal, NotebookService, NoteService) {

	$scope.search = function() {
		if (NotebookService.selectedNotebook != null) {
			NoteService.getList(NotebookService.selectedNotebook, $scope.query);
		}
	}

	$scope.createNote = function() {
		if (NotebookService.selectedNotebook != null) {
			NoteService.createNote(NotebookService.selectedNotebook);
		}
	}

	$scope.$on('notebooks.select', function(event, book) {
		$scope.query = '';
	});

	$scope.query = '';

  	$scope.showNewNotebookModal = function() {
	    $modal.open({
			templateUrl: 'newNotebookModal.html',
      		controller: createNotebookModalInstanceCtrl,
    	});
	};

}]);

module.controller('NotebookListController', ['$scope', '$rootScope', 'NotebookService', function($scope, $rootScope, NotebookService) {

	$scope.$on('notebooks.load', function(event) {
		$scope.notebooks = NotebookService.notebooks;
		$scope.selectNotebook($scope.notebooks[0]);
	});

	$scope.$on('notebooks.create', function(event, book) {
		$scope.notebooks = NotebookService.notebooks;
		$scope.selectNotebook(book);
	});

	$scope.$on('notes.delete', function(event, book) {
		NotebookService.selectedNotebook.noteCount--;
	});

	$scope.init = function() {
		NotebookService.getList();
	}

	$scope.selectNotebook = function(book) {
		NotebookService.selectNotebook(book);
	}

	$scope.noteBookIsSelected = function(book) {
		return book == NotebookService.selectedNotebook;
	}

	$scope.notebooks = NotebookService.notebooks;
}]);

module.controller('NoteListController', ['$scope', '$rootScope', 'NotebookService', 'NoteService', function($scope, $rootScope, NotebookService, NoteService) {

	$scope.$on('notebooks.select', function(event, book) {
		$scope.selectedNotebook = book;
		NoteService.getList(book);
	});

	$scope.$on('notes.load', function(event, search) {
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
	}

	$scope.deleteNotebook = function(notebook) {
		NotebookService.deleteNotebook(notebook);
	}

	$scope.noteIsSelected = function(note) {
		return note == NoteService.selectedNote;
	}

	$scope.selectedNotebook = null;
	$scope.notes = NoteService.notes;

	$scope.search = false;

}]);

module.controller('NoteDetailController', ['$scope', 'NotebookService', 'NoteService', function($scope, NotebookService, NoteService) {

	$scope.$on('notebooks.load', function(event) {
		$scope.notebooks = NotebookService.notebooks;
	});

	$scope.$on('notebooks.select', function(event, book) {
		$scope.note = null;
		$scope.noteForm.$setPristine();
	});

	$scope.$on('notes.select', function(event, note) {

		if (note.id) {
			note.$get(function() {
				$scope.note = note;
				$scope.noteForm.$setPristine();
			});			
		} else {
			$scope.note = note;
			$scope.noteForm.$setPristine();
		}

	});

	$scope.$on('notes.created', function(event, note) {
		$scope.note = note;
	});

	$scope.$on('notes.update', function(event) {
		$scope.noteForm.$setPristine();
	});

	$scope.saveNote = function(note) {
		NoteService.saveNote(note);
	}

	$scope.deleteNote = function(note) {
		NoteService.deleteNote(note);
	};

	$scope.notebooks = NotebookService.notebooks;

}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
var createNotebookModalInstanceCtrl = function ($scope, $modalInstance, NotebookService) {

	$scope.newNotebook = {};

	$scope.ok = function () {
		NotebookService.addNotebook($scope.newNotebook, function() {
			$modalInstance.close();		
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};