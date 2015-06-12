(function() {
  'use strict';

  angular
    .module('app')
    .directive('fileReader', ['DumprService', fileReader]);

  function fileReader(DumprService) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.change(function(changeEvent) {
          var files = changeEvent.target.files;
          if (files.length) {
            var r = new FileReader();
            r.onload = function(e) {
              var contents = e.target.result;
              var uploadedDumps = JSON.parse(contents);
              DumprService.addDumps(uploadedDumps).then(function(dumps) {
                scope.dumps = dumps;
              });
            };

            r.readAsText(files[0]);
          }
        });
      }
    };
  };
})();