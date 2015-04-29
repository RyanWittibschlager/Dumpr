(function() {
  var currentUrl = "";
  chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
      console.log(tabArray[0].url);
      currentUrl = tabArray[0].url;
  });

  function createDumpURL(url, appended, substring) {
      // strip everything after the slot number
      var dumpURL = substring.length > 0
                  ? url.substring(0, url.indexOf("/", url.toLowerCase().indexOf(substring.toLowerCase())))
                  : url;

      // append the dump url
      dumpURL += "/" + appended;

      return dumpURL;
  }

  chrome.storage.local.get('dumpConfig', function(items) {
    if (items.dumpConfig && items.dumpConfig.length > 0) {
      var dumpConfig = items.dumpConfig;
      for (var i=0; i<dumpConfig.length; i++) {
        if (dumpConfig[i].active) {
          var dumpUrl = createDumpURL(currentUrl,
            dumpConfig[i].appended,
            dumpConfig[i].substring);
          chrome.tabs.create({ url: dumpUrl});
          break;
        }
      }
    } else {
      var optionsUrl = chrome.extension.getURL('options.html');
      document.querySelector('#message').innerHTML = 'Add dumps in the <a target="_blank" href="' +
          optionsUrl + '">options page</a> first.';
    }
  });
})();