var toDoListApp = angular.module('BrainDumpApp', ['ngResource']);

// @TODO: Organize into different controllers
toDoListApp.controller('NotebookController', function($scope, $http, $compile, $resource) {
	
	var urls = {
		baseUrl : 'http://braindump-api.local',
		notebooks : function() { return this.baseUrl + '/notebooks/:id'; },
		notes : function() { return this.baseUrl + '/notebooks/:notebookId/notes/:noteId'; }
	}

	// @TODO Move to service
	NotebookResource = $resource(urls.notebooks(), { id: '@id' });
	NoteResource = $resource(urls.notes(), { notebookId: '@notebook_id', noteId: '@id' }, {
		update: { method: 'PUT' }
	});
	
	// Model
	$scope.notebooks = [];
	$scope.newNotebook = new NotebookResource();
	$scope.selectedNotebook = { id: null };


	$scope.notes = [];
	$scope.selectedNote = null;

	// Events
	$scope.init = function() {
		$scope.getNotebooks();
	}

	// Loads notebooks model from backend.
	// If the list is non-empty, select the first notebook
	$scope.getNotebooks = function() {
		$scope.notebooks = NotebookResource.query(function() {
			if ($scope.notebooks.length > 0) {
				$scope.selectNotebook($scope.notebooks[0]);	
			}
		});
	};

	// Creates notebook on backend and updates model on success
	$scope.addNotebook = function() {
		$scope.newNotebook.$save(function() {
			$scope.notebooks.push($scope.newNotebook);
			$scope.newNotebook = new NotebookResource();
			$scope.notebookForm.$setPristine();
		});
	};

	// Marks a notebook as selected and loads notes without content
	// from backend
	$scope.selectNotebook = function(book) {
		$scope.selectedNotebook = book;
		$scope.selectedNote = null;
		$scope.getNotes(book);
	}

	// Deletes notebook on backend and updates model on success
	// If the list of notebooks is non-empty, select the first notebook
	$scope.deleteNotebook = function(book) {
		book.$delete(function() {
			$scope.notebooks.splice($scope.notebooks.indexOf(book), 1);

			if (book == $scope.selectedNotebook) {
				$scope.selectNotebook($scope.notebooks[0]);	
			}
		});
	}

	// Loads notes without content for given notebook from backend
	// If list is non-emtpy, select the first listk
	$scope.getNotes = function(book) {
		$scope.notes = NoteResource.query({notebookId: $scope.selectedNotebook.id }, function() {
			if ($scope.notes.length > 0) {
				$scope.selectNote($scope.notes[0]);	
			}
		});
	}

	$scope.selectNote = function(note) {
		$scope.selectedNote = note;
		if ("id" in note) {
			note.$get();
		}
	}

	$scope.createNote = function() {
		if ($scope.selectedNotebook == null) {
			alert('No notebook selected');
			return;
		}

		newNote = new NoteResource({ notebook_id: $scope.selectedNotebook.id, title: "New Note", url: "", content: "", created: Date.now()/1000, updated: Date.now()/1000 });
		$scope.notes.push(newNote);
		$scope.selectedNotebook.noteCount = $scope.notes.length;
		$scope.selectedNote = newNote;
	}

	$scope.saveNote = function(note) {
		if (note.id == null) {
			note.$save(function() {
				$scope.noteForm.$setPristine();
			});
		} else {
			note.$update(function() {
				$scope.noteForm.$setPristine();
			});
		}
	}

	$scope.deleteNote = function(note) {
		// TODO determine correct follow up action (show another note, show null)
		var afterDelete = function() {
			$scope.notes.splice($scope.notes.indexOf(note), 1);
			$scope.selectedNotebook.noteCount = $scope.notes.length;
			if (note == $scope.selectedNote) {
				$scope.selectNote($scope.notes[0]);	
			}
		}

		if (note.id == null) {
			afterDelete();
		} else {
			note.$delete(afterDelete);
		}			
	}
});