var module = angular.module('BrainDumpApp', ['ngResource', 'ui.bootstrap', 'textAngular', 'braindump.notebooks', 'braindump.notes']);

module.controller('AppController', [ '$scope', 'NotebookService', 'NoteService', function($scope, NotebookService, NoteService) {

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

}]);

module.controller('NotebookListController', ['$scope', '$rootScope', 'NotebookService', function($scope, $rootScope, NotebookService) {

	$scope.$on('notebooks.load', function(event) {
		$scope.notebooks = NotebookService.notebooks;
		$scope.selectNotebook($scope.notebooks[0]);
	});

	$scope.$on('notebooks.create', function(event, book) {
		$scope.notebooks = NotebookService.notebooks;
		$scope.selectNotebook(book);
		$scope.newNotebook = {};
		$scope.notebookForm.$setPristine();
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

	$scope.addNotebook = function() {
		NotebookService.addNotebook($scope.newNotebook);
	};

	$scope.deleteNotebook = function(book) {
		NotebookService.deleteNotebook(book);
	}

	$scope.noteBookIsSelected = function(book) {
		return book == NotebookService.selectedNotebook;
	}

	$scope.notebooks = NotebookService.notebooks;
	$scope.newNotebook = {};

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

module.controller('NoteDetailController', ['$scope', 'NoteService', function($scope, NoteService) {

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

}]);