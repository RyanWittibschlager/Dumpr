dumprApp.controller("DumprController", ["$scope", "DumprService", function($scope, DumprService) {
  DumprService.getDumps().then(function(dumps){
    $scope.dumps = dumps;
  });

  $scope.hideHelpText = function() {
    $scope.help1 = false;
  }

  $scope.addDump = function(dump) {

    DumprService.addDumps([dump]).then(function(dumps){
      $scope.dumps = dumps;
    });

    delete $scope.dump;
  }

  $scope.removeDump = function(dump) {
    DumprService.removeDump(dump).then(function(dumps){
      $scope.dumps = dumps;
    });
  }

  $scope.activateDump = function(dump) {
    DumprService.activateDump(dump).then(function(dumps){
      $scope.dumps = dumps;
    });
  }
}]);