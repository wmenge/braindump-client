var notebooksModule = angular.module('braindump.notebooks', ['ngResource']);

notebooksModule.factory('Notebooks', ['$resource', function($resource) {
	return $resource(
		'http://braindump-api.local/notebooks/:id',
		{ id: '@id' },
		{ update: { method: 'PUT' } });
}]);

notebooksModule.service( 'NotebookService', [ '$rootScope', 'Notebooks', function($rootScope, Notebooks) {

	var service = {
		// Magic notebook, contains all notes for user
		magicNotebook: { title: 'All notes' },
		selectedNotebook: null,
		notebooks: [],
		getList: function (sortPredicate) {
			service.notebooks = Notebooks.query({ sort: sortPredicate }, function() {

				if (service.selectedNotebook === null) {
					service.selectNotebook(service.magicNotebook);
				}

				$rootScope.$broadcast('notebooks.load');
	
			});
		},
		addNotebook: function(book, success) {
			Notebooks.save(book, function(newBook) {
				service.notebooks.push(newBook);
				$rootScope.$broadcast('notebooks.create', newBook);
				service.selectNotebook(newBook);
				success();
			});
		},
		updateNotebook: function(book, success) {
			book.$update(function() {
				$rootScope.$broadcast('notebooks.update');
				success();
			});
		},
		deleteNotebook: function(book) {
			Notebooks.delete(book, function() {
				service.notebooks.splice(service.notebooks.indexOf(book), 1);
				if (service.selectedNotebook == book) {
					service.selectNotebook(service.magicNotebook);
				}
				$rootScope.$broadcast('notebooks.delete', book);
			});
		},
		selectNotebook: function(book) {
			service.selectedNotebook = book;
			$rootScope.$broadcast('notebooks.select', book);
		}
	};

   return service;
   
}]);