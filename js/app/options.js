dumprApp.service("DumprService", ["$q", function($q) {
  var storage = chrome.storage.local;

  this.getDumps = function() {
    return $q(function(resolve) {
      storage.get('dumpConfig', function(items) {
        if (items.dumpConfig) {
          resolve(items.dumpConfig);
        }
      });
    });    
  }

  this.addDump = function(dump) {
    dump.active = true;
    return $q(function(resolve) {
      storage.get('dumpConfig', function(items) {
        var dumpConfig = items.dumpConfig;
        if (dumpConfig) {
          // deactivate current dump
          for (var i=0; i<dumpConfig.length; i++) {
            if(dumpConfig[i].active)
              dumpConfig[i].active = false;
          }
          // add new dump
          dump.id = dumpConfig.length;
          dumpConfig[dumpConfig.length] = dump;
        } else {
          dumpConfig = [];
          dump.id = 0;
          dumpConfig[0] = dump;
        }
        // save the dumpConfig
        storage.set({'dumpConfig': dumpConfig}, function() {
          resolve(dumpConfig);
        });
      });
    });
  }

    this.addDumps = function(dumps) {
    //dump.active = true;
    return $q(function(resolve) {
      storage.get('dumpConfig', function(items) {
        var dumpConfig = items.dumpConfig;
        if (dumpConfig) {
          // deactivate current dump
          for (var i=0; i<dumpConfig.length; i++) {
            if(dumpConfig[i].active)
              dumpConfig[i].active = false;
          }
          // add new dumps
          for (var i = 0; i < dumps.length; i++) {
            dumps[i].id = dumpConfig.length;
            dumps[i].active = i == (dumps.length - 1) ? true : false;
            dumpConfig[dumpConfig.length] = dumps[i];
          }
        } else {
          dumpConfig = [];
          for (var i = 0; i < dumps.length; i++) {
            dumps[i].id = i;
            dumps[i].active = i == (dumps.length - 1) ? true : false;
            dumpConfig[i] = dumps[i];
          }
        }
        // save the dumpConfig
        storage.set({'dumpConfig': dumpConfig}, function() {
          resolve(dumpConfig);
        });
      });
    });
  }

  this.removeDump = function(dump) {
    return $q(function(resolve) {
      storage.get('dumpConfig', function(items) {
        var dumpConfig = items.dumpConfig;
        if (dumpConfig) {
          // activate a new dump if one exists
          if (dumpConfig[dump.id].active && dumpConfig.length > 1) {
            if (dump.id > 0) {
              dumpConfig[dump.id - 1].active = true;
            } else {
              dumpConfig[dump.id + 1].active = true;
            }
          }
          // remove the dump
          for (var i=parseInt(dump.id); i<dumpConfig.length; i++) {
            if (i + 1 == dumpConfig.length) {
              --dumpConfig.length;
              break;
            } else {
              dumpConfig[i] = dumpConfig[i+1];
              dumpConfig[i].id = i;
            }
          }
          // Save the current dumpConfig
          storage.set({'dumpConfig': dumpConfig}, function() {
            resolve(dumpConfig);
          });
        }
      });
    });
  }

  this.activateDump = function(dump) {
    return $q(function(resolve) {
      storage.get('dumpConfig', function(items) {
        var dumpConfig = items.dumpConfig;
        if (dumpConfig) {
          for (var i=0; i<dumpConfig.length; i++) {
            if (dumpConfig[i].active) {
              dumpConfig[i].active = false;
            }
            if (i == dump.id) {
              dumpConfig[i].active = true;
            }
          }
          // Save it using the Chrome extension storage API.
          storage.set({'dumpConfig': dumpConfig}, function() {
            resolve(dumpConfig);
          });
        }
      });
    });    
  }
}]);

dumprApp.directive('fileReader', ['DumprService', function(DumprService) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.change(function(changeEvent) {
        var files = changeEvent.target.files;
        if (files.length) {
          var r = new FileReader();
          r.onload = function(e) {
            var contents = e.target.result;

            // scope.$apply(function () {
            //   scope.fileReader = contents;
            //   console.log('contents is ' + contents);
            // });

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
}]);

dumprApp.controller("DumprController", ["$scope", "DumprService", function($scope, DumprService) {
  DumprService.getDumps().then(function(dumps){
    $scope.dumps = dumps;
  });

  $scope.hideHelpText = function() {
    $scope.help1 = false;
  }

  $scope.addDump = function(dump) {

    DumprService.addDump(dump).then(function(dumps){
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

  $scope.$watch('dumps', function() {
    console.log('changed!');
  });
}]);