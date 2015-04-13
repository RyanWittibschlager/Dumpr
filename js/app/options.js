dumprApp.service("DumprService", function($q) {
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
});

dumprApp.controller("DumprController", function($scope, DumprService) {
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
});


// -------------------- old code below, should not be used! ------------------------------------


  var bigLittleMan;

  function uploadDump(evt) {
    var file = evt.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var contents = e.target.result;
        //console.log("name of file: " + file.name);
        //console.log("type of file: " + file.type);
        //console.log("contents of file: " + contents);
        //console.log("typeof contents: " + typeof contents);

        try {
          bigLittleMan = JSON.parse(contents);
        }
        catch (ex) {
          console.error("Your JSON is messed up: ", ex.message);
        }
        //console.log('bigLittleMan.length is: ' + bigLittleMan.length);
        //console.log('bigLittleMan[0].appended ' + bigLittleMan[0].appended);
        //console.log('bigLittleMan[0].substring ' + bigLittleMan[0].substring);
        //console.log('bigLittleMan[1].appended ' + bigLittleMan[1].appended);
        //console.log('bigLittleMan[1].substring ' + bigLittleMan[1].substring);
        var myAppended = $('#myAppended');
        var mySubstring = $('#mySubstring');
        for (var i = bigLittleMan.length - 1; i >= 0; i--) {
          myAppended.val(bigLittleMan[i].appended);
          mySubstring.val(bigLittleMan[i].substring);
          addDump(true);
        }
        reloadTable();
      }
      reader.readAsText(file);
    } else {
      console.log("Failed to load file");
    }
  }

  // ----------------------------------------------------------------------------

  // displays a message next to the 'Add' button for 3 seconds
  function message(msg) {
    var message = $('#theMessage');
    message.text(msg);
    setTimeout(function() {
      message.text('');
    }, 3000);
  }
