// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Store CSS data in the "local" storage area.
//
// See note in options.js for rationale on why not to use "sync".
var storage = chrome.storage.local;
// clear it for now
storage.clear();
var message = document.querySelector('#message');

var currentUrl = "";
chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
    console.log(tabArray[0].url);
    currentUrl = tabArray[0].url;
});

// Check if there is CSS specified.
storage.get('dumpConfig', function(items) {
  console.log("items: " + items);
  // If there is CSS specified, inject it into the page.
  if (items.dumpConfig) {
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
    message.innerHTML = 'Add dumps in the <a target="_blank" href="' +
        optionsUrl + '">options page</a> first.';
  }
});

var createDumpURL = function (url, appended, substring) {
    // strip everything after the slot number
    var dumpURL = url.substring(0, url.indexOf("/", url.toLowerCase().indexOf(substring.toLowerCase())));

    // append the dump url
    dumpURL += "/" + appended;

    return dumpURL;
}