describe('DumprController', function() {
	beforeEach(module('DumprApp'));

	var $controller;

	beforeEach(inject(function(_$controller_) {
		$controller = _$controller_;
	}));

	describe('$scope.dumps', function() {
		it('gets the dumps from DumprService', function() {
			var $scope = {};
			var controller = $controller('DumprController', { $scope: $scope });
		})
	});
});