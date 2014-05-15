var module = angular.module('BrainDumpApp', ['ngResource', 'textAngular', 'braindump.notebooks', 'braindump.notes']);

module.controller('AppController', [ '$scope', 'NotebookService', 'NoteService', function($scope, NotebookService, NoteService) {

	$scope.createNote = function() {
		if (NotebookService.selectedNotebook != null) {
			NoteService.createNote(NotebookService.selectedNotebook);
		}
	}

}]);

module.controller('NotebookListController', ['$scope', '$rootScope', 'NotebookService', function($scope, $rootScope, NotebookService) {

	$scope.$on('notebooks.load', function(event) {
		$scope.notebooks = NotebookService.notebooks;
		$scope.selectNotebook($scope.notebooks[0]);
	});

	$scope.$on('notebooks.create', function(event, book) {
		$scope.notebooks = NotebookService.notebooks;
		$scope.selectNotebook(book);
		$scope.notebookForm.$setPristine();
	});

	$scope.$on('notes.delete', function(event, book) {
		NotebookService.selectedNotebook.noteCount--;
	});

	$scope.init = function() {
		NotebookService.getList();
	}

	$scope.selectNotebook = function(book) {
		NotebookService.selectedNotebook = book;
		$rootScope.$broadcast('notebooks.select', book);
	}

	$scope.addNotebook = function() {
		NotebookService.addNotebook($scope.newNotebook);
	};

	$scope.deleteNotebook = function(book) {
		NotebookService.deleteNotebook(book);
	}

	$scope.notebooks = NotebookService.notebooks;
	$scope.newNotebook = {};

}]);

module.controller('NoteListController', ['$scope', '$rootScope', 'NoteService', function($scope, $rootScope, NoteService) {

	$scope.$on('notebooks.select', function(event, book) {
		$scope.selectedNotebook = book;
		NoteService.getList(book);
	});

	$scope.$on('notes.load', function(event) {
		$scope.notes = NoteService.notes;
		if ($scope.notes.length > 0) {
			$scope.selectNote($scope.notes[0]);
		}
	});

	$scope.$on('notes.delete', function(event, note) {
		console.log(1);
		$scope.notes.splice($scope.notes.indexOf(note), 1);
		
		if (NoteService.selectedNote == note) {
			console.log(2);
			$scope.selectNote($scope.notes[0]);
		}
	});

	$scope.selectNote = function(note) {
		NoteService.selectedNote = note;		
		$rootScope.$broadcast('notes.select', note);
	}

	$scope.selectedNotebook = null;
	$scope.notes = NoteService.notes;

}]);

module.controller('NoteDetailController', ['$scope', 'NoteService', function($scope, NoteService) {

	$scope.$on('notebooks.select', function(event, book) {
		$scope.note = null;
		$scope.noteForm.$setPristine();
	});

	$scope.$on('notes.select', function(event, note) {
		note.$get(function() {
			$scope.note = note;
			// doesn't work. Why? Is note a future?
			$scope.noteForm.$setPristine();
		});
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