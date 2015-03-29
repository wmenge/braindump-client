var notesModules = angular.module('braindump.notes', ['ngResource', 'braindump.notebooks']);

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

notesModules.service( 'NoteService', [ '$rootScope', 'Notes', 'AllNotes', 'NotebookService', function($rootScope, Notes, AllNotes, NotebookService) {

	var service = {
		selectedNote: null,
		notes: [],
		getList: function(book, query, sortPredicate) {

			if (book == NotebookService.magicNotebook) {

				service.notes = AllNotes.query({ q: query, sort: sortPredicate },
					function() {
						$rootScope.$broadcast('notes.load', (query !== null));
					},
					function() {
						$rootScope.$broadcast('notes.load', (query !== null));
						// Todo: show some error message
						service.notes = [];
					});

			} else {

				service.notes = Notes.query({notebookId: book.id, sort: sortPredicate, q: query },
					function() {
						$rootScope.$broadcast('notes.load', (query !== null));
					},
					function() {
						$rootScope.$broadcast('notes.load', (query !== null));
						// Todo: show some error message
						service.notes = [];
					});

			}
		},
		createNote: function(book) {
			newNote = new Notes({
				notebook_id: book.id,
				url: "",
				type: "HTML",
				content: "",
				created: Date.now()/1000,
				updated: Date.now()/1000 });
			service.notes.push(newNote);
			book.noteCount++;
			service.selectedNote = newNote;
			$rootScope.$broadcast('notes.created', newNote);
		},
		saveNote: function(note) {
			// todo: check difference between == and ===
			// sublime wants to use ===, but this does not have desired effect
			if (note.id == null) {
				note.$save(
					function() {
						$rootScope.$broadcast('notes.update.success');
					},
					function() {
						$rootScope.$broadcast('notes.update.error');
					});
			} else {
				note.$update(
					function() {
						$rootScope.$broadcast('notes.update.success');
					},
					function() {
						$rootScope.$broadcast('notes.update.error');
					});
			}
		},
		deleteNote: function(note) {
			if (note.id === null)
			{
				$rootScope.$broadcast('notes.delete', note);
			} else {
				note.$delete(function() {
					$rootScope.$broadcast('notes.delete', note);
				});
			}
		},
		selectNote: function(note) {
			service.selectedNote = note;
			$rootScope.$broadcast('notes.select', note);
		}
	};

	return service;
}]);
