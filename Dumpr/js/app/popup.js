// Author: Ryan Wittibschlager
// License: ...there is none? Do whatever you want with this code.


// clear it for now
//chrome.storage.local.clear();

var currentUrl = "";
chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
    console.log(tabArray[0].url);
    currentUrl = tabArray[0].url;
});

// Check if there is CSS specified.
chrome.storage.local.get('dumpConfig', function(items) {
  console.log("items: " + items);
  // If there is CSS specified, inject it into the page.
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

var createDumpURL = function (url, appended, substring) {
    // strip everything after the slot number
    var dumpURL = substring.length > 0
                ? url.substring(0, url.indexOf("/", url.toLowerCase().indexOf(substring.toLowerCase())))
                : url;

    // append the dump url
    dumpURL += "/" + appended;

    return dumpURL;
}