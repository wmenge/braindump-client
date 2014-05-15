var notesModules = angular.module('braindump.notes', ['ngResource']);

notesModules.factory('Notes', ['$resource', function($resource) {
	return $resource(
		'http://braindump-api.local/notebooks/:notebookId/notes/:noteId', 
		{ notebookId: '@notebook_id', noteId: '@id' },
		{ update: { method: 'PUT' } });
}]);

notesModules.service( 'NoteService', [ '$rootScope', 'Notes', function($rootScope, Notes) {

	var service = {
		selectedNote: null, // TODO: Create a select function on the service?
		notes: [],
		getList: function(book) {
			service.notes = Notes.query({notebookId: book.id }, function() {
				$rootScope.$broadcast('notes.load');
			});
		},
		createNote: function(book) {
			newNote = new Notes({ 
				notebook_id: book.id, 
				title: "New note", 
				url: "", 
				type: "HTML", 
				content: "", 
				created: Date.now()/1000, 
				updated: Date.now()/1000 });
			service.notes.push(newNote);
			book.noteCount++;
			$rootScope.$broadcast('notes.created', newNote);
		},
		saveNote: function(note) {
			if (note.id == null) {
				note.$save(function() {
					$rootScope.$broadcast('notes.update');
				});
			} else {
				note.$update(function() {
					$rootScope.$broadcast('notes.update');
				});
			}
		},
		deleteNote: function(note) {
			if (note.id == null) {
				$rootScope.$broadcast('notes.delete', note);
			} else {
				note.$delete(function() {
					$rootScope.$broadcast('notes.delete', note);
				});
			}	
		}
	} 
   return service;
}]);
