(function() {
  'use strict';

  angular
    .module('app')
    .controller('DumprController', ['$scope', 'DumprService', DumprController]);

  function DumprController($scope, DumprService) {
    var vm = this;

    DumprService.getDumps().then(function(dumps){
      vm.dumps = dumps;
    });

    //$scope.$watch('vm.dumps', function(current, original) {
    //  alert('hey, dummps changed!');
    //});

    vm.hideHelpText = function() {
      vm.help1 = false;
    }

    vm.addDump = function(dump) {

      DumprService.addDumps([dump]).then(function(dumps){
        vm.dumps = dumps;
      });

      delete vm.dump;
    }

    vm.removeDump = function(dump) {
      DumprService.removeDump(dump).then(function(dumps){
        vm.dumps = dumps;
      });
    }

    vm.activateDump = function(dump) {
      DumprService.activateDump(dump).then(function(dumps){
        vm.dumps = dumps;
      });
    }
  };
})();