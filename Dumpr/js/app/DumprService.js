(function() {
  'use strict';

  angular
    .module('app')
    .service('DumprService', ['$q', DumprService]);

  function DumprService($q) {
    var storage = chrome.storage.local;

    // gets the dumpConfig in chrome local storage
    this.getDumps = function() {
      return $q(function(resolve) {
        storage.get('dumpConfig', function(items) {
          if (items.dumpConfig) {
            resolve(items.dumpConfig);
          }
        });
      });    
    }

    // adds multiple dumps to the dumpConfig object, saves it to chrome
    // local storage, and returns the newly updated dumpConfig object
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
            for (var i = dumps.length - 1; i >= 0; i--) {
              dumps[i].id = dumpConfig.length;
              dumps[i].active = i == 0 ? true : false;
              dumpConfig[dumpConfig.length] = dumps[i];
            }
          } else {
            dumpConfig = [];
            for (var i = dumps.length - 1; i >= 0; i--) {
              dumps[i].id = i;
              dumps[i].active = i == 0 ? true : false;
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
  };
})();