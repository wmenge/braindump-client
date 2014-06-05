var notebooksModule = angular.module('braindump.notebooks', ['ngResource']);

notebooksModule.factory('Notebooks', ['$resource', function($resource) {
	return $resource(
		'http://braindump-api.local/notebooks/:id', 
		{ id: '@id' });
}]);

notebooksModule.service( 'NotebookService', [ '$rootScope', 'Notebooks', function($rootScope, Notebooks) {

	var service = {
		selectedNotebook: null, // TODO: Create a select function on the service?
		notebooks: [],
		getList: function () {
			service.notebooks = Notebooks.query(function() {
				$rootScope.$broadcast('notebooks.load');
			});		
		},
		addNotebook: function(book) {
			Notebooks.save(book, function(newBook) {
				service.notebooks.push(newBook);
				$rootScope.$broadcast('notebooks.create', newBook);
			});
		},
		deleteNotebook: function(book) {
			Notebooks.delete(book, function() {
				service.notebooks.splice(service.notebooks.indexOf(book), 1);
				$rootScope.$broadcast('notebooks.delete', book);
			});
		}
	} 
   return service;
}]);