// Author: Ryan Wittibschlager
//
// There is no license for this extension. It is not a publicly available chrome
// extension. I am just distributing it to fellow IT people here at Progressive
// for use.

var createDumpURL = function (url) {
    // strip everything after the slot number
    var dumpURL = url.substring(0, url.indexOf("/", url.toLowerCase().indexOf("slot")));

    // append the dump url
    dumpURL += "/debug/public/dumprawbusinessobject.aspx";

    return dumpURL;
};

chrome.browserAction.onClicked.addListener(function (tab) {
    var dumpURL = createDumpURL(tab.url);
    chrome.tabs.create({ url: dumpURL });
});