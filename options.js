// I had to use jQuery for bootstrap...
// ...so I used it here too :)

(function(){
  // set up the storage variable
  var storage = chrome.storage.local;

  // adds a dump to our dumpConfig object, saves it, and reloads the table
  function addDump() {
    // get appended and substring values from form
    var myAppended = $('#myAppended');
    var mySubstring = $('#mySubstring');

    var appended = myAppended.val();
    var substring = mySubstring.val();

    myAppended.val('');
    mySubstring.val('');

    if (!appended) {
      message("missing something!");
      return;
    }

    // create the dump
    var dump = {
      'appended': appended,
      'substring': substring,
      'active': true
    };

    // get our dumpConfig object, add our dump to it
    storage.get('dumpConfig', function(items) {
      var dumpConfig = items.dumpConfig;
      if (dumpConfig) {
        for (var i=0; i<dumpConfig.length; i++) {
          if(dumpConfig[i].active)
            dumpConfig[i].active = false;
        }
        dump.id = dumpConfig.length;
        dumpConfig[dumpConfig.length] = dump;
      } else {
        dumpConfig = [];
        dump.id = 0;
        dumpConfig[0] = dump;
      }

      // save the dumpConfig
      storage.set({'dumpConfig': dumpConfig}, function() {
        // Notify that we saved.
        message('Settings saved');
        reloadTable();
      });
    });
  }

  // --------------------------------------------------------------------------
  // This code is broken. Needs looked at.

  var bigLittleMan;

  function uploadDump(evt) {
    var file = evt.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var contents = e.target.result;
        console.log("name of file: " + file.name);
        console.log("type of file: " + file.type);
        console.log("contents of file: " + contents);
        console.log("typeof contents: " + typeof contents);

        try {
          bigLittleMan = JSON.parse(contents);
        }
        catch (ex) {
          console.error("Your JSON is messed up: ", ex.message);
        }

        var myAppended = document.querySelector('#myAppended');
        var mySubstring = document.querySelector('#mySubstring');
        for (var i = bigLittleMan.length - 1; i >= 0; i--) {
          myAppended.value = bigLittleMan[i].appended;
          mySubstring.value = bigLittleMan[i].substring;
          addDump();
        }
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

  // initial loading
  function loadThisDude() {
    storage.get('dumpConfig', function(items) {
      if (items.dumpConfig) {
        var dumpConfig = items.dumpConfig;

        if (dumpConfig) {
          var theDumpTable = document.getElementById('theDumpTable');
          for (var i = dumpConfig.length - 1; i >= 0; i--) {
            var removeBtn = document.createElement("INPUT");
            removeBtn.setAttribute("type", "button");
            removeBtn.setAttribute("name", "remove");
            removeBtn.setAttribute("value", "X");
            removeBtn.setAttribute("class", "btn btn-danger");
            removeBtn.setAttribute("id", dumpConfig[i].id);
            removeBtn.onclick = remove;

            var appended = dumpConfig[i].appended;
            var substring = dumpConfig[i].substring;

            var active = document.createElement("INPUT");
            active.setAttribute("type", "radio");
            active.setAttribute("name", "activeStatus");
            active.setAttribute("id", dumpConfig[i].id);
            active.checked = dumpConfig[i].active;
            active.onclick = activate;

            var row = theDumpTable.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);

            cell1.appendChild(removeBtn);
            cell2.innerHTML = appended;
            cell3.innerHTML = substring;
            cell4.appendChild(active);
          }
        }
      } else {
        console.log("well i got here i guess");
      }

      if (theDumpTable.rows.length < 2) {
        document.getElementById("emptyInventory").style.display = "inline";
      } else {
        document.getElementById("emptyInventory").style.display = "none";
      }
    });
    
  }

  var activate = function() {
    var id = this.id;
    storage.get('dumpConfig', function(items) {
      var dumpConfig = items.dumpConfig;
      if (dumpConfig) {
        for (var i=0; i<dumpConfig.length; i++) {
          if (dumpConfig[i].active) {
            dumpConfig[i].active = false;
          }
          if (i == id) {
            console.log("truthify!");
            dumpConfig[i].active = true;
          }
        }
        // Save it using the Chrome extension storage API.
        storage.set({'dumpConfig': dumpConfig}, function() {
          // Notify that we saved.
          message('Settings saved');
        });
      } else {
        console.log("well i got here i guess2");
      }
    });
  }

  var remove = function() {
    // grab id of 'this'
    var id = parseInt(this.id);
    console.log("got here");

    storage.get('dumpConfig', function(items) {
      var dumpConfig = items.dumpConfig;
      if (dumpConfig) {
        // activate a new dump if one exists
        if (dumpConfig[id].active && dumpConfig.length > 1) {
          if (id > 0) {
            dumpConfig[id - 1].active = true;
          } else {
            dumpConfig[id + 1].active = true;
          }
        }

        for (var i=parseInt(id); i<dumpConfig.length; i++) {
          console.log("got here too");
          if (i + 1 == dumpConfig.length) {
            console.log("got here as well");
            --dumpConfig.length;
            break;
          } else {
            dumpConfig[i] = dumpConfig[i+1];
            dumpConfig[i].id = i;
          }
        }
        // Save it using the Chrome extension storage API.
        storage.set({'dumpConfig': dumpConfig}, function() {
          // Notify that we saved.
          message('Settings saved');
          reloadTable();
        });
      } else {
        console.log("well i got here i guess2");
      }
    });
  }

  var reloadTable = function() {
    var theDumpTable = document.getElementById('theDumpTable');        
    var tableLength = theDumpTable.rows.length;

    while (theDumpTable.rows.length > 1) {
      theDumpTable.deleteRow(1);
    }

    loadThisDude();
  }

  document.querySelector('button.submit').addEventListener('click', addDump);
  document.querySelector('input#uploader').addEventListener('change', uploadDump);
  loadThisDude();

  $("#uploadOption").click(function() {
    $("#uploadStuff").fadeIn("slow");
  });

  $("#help1btn").click(function() {
    $("#help1").fadeIn("slow");
  });

  $("#help2btn").click(function() {
    $("#help2").fadeIn("slow");
  });

  $("#help3btn").click(function() {
    $("#help3").fadeIn("slow");
  });

  $("#help4btn").click(function() {
    $("#help3").fadeOut("slow");
    $("#help2").fadeOut("slow");
    $("#help1").fadeOut("slow");
  });

}());


// LOTS OF GREAT FEATURES IMPLEMENTED!! WOO HOO!!
// Things to do:
// 1. take care of the "Settings saved" message(s), use fadein/fadeOut
// |---> DONE!
// 1.5 make the "leave blank to append to URL" functionality work
// |---> DONE!
// 1.6 Create the load JSON feature
// 2. clean up code. refactor.
// 3. do some system testing.
// 4. ask Abbey to test it.