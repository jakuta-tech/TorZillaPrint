/* TABLE:  Cookies & Storage */

'use strict';

// functions
function getCookie(cname) {
  var name = cname + "="; var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {c = c.substring(1);}
    if (c.indexOf(name) == 0) {return c.substring(name.length, c.length);}
  }
  return "";
};
function rndString() {return Math.random().toString(36).substring(2, 15);};
function rndNumber() {return Math.floor ( (Math.random() * (99999 - 10000)) + 10000);};
var rndStr = "";

// cookie support
if (navigator.cookieEnabled == true) {dom.nCookieEnabled="enabled"} else {dom.nCookieEnabled="disabled"};
// cookie test: run even if cookieEnabled = false
rndStr = rndString(); document.cookie = rndStr+"="+rndStr;
if (getCookie(rndStr) != ""){dom.cookieTest="success"} else {dom.cookieTest="failed"};

// localStorage support
try {
  if (typeof(localStorage) != "undefined") {dom.storageLSupport="enabled";}
  else {dom.storageLSupport="disabled: undefined"};
} catch(e) {dom.storageLSupport="disabled: " + e.name};
// localStorage test: run even if localStorage unavailable
rndStr = rndString();
try {localStorage.setItem(rndStr, rndStr);
  if(!localStorage.getItem(rndStr)) {dom.storageLTest="failed"} else {dom.storageLTest="success"};
} catch(e) {dom.storageLTest="failed: " + e.name};

// sessionStorage support
try {
  if (typeof(sessionStorage) != "undefined") {dom.storageSSupport="enabled"}
  else {dom.storageSSupport="disabled: undefined"};
} catch(e) {dom.storageSSupport="disabled: " + e.name};
// sessionStorage test: run even if sessionStorage unavailable
rndStr = rndString();
try {sessionStorage.setItem(rndStr, rndStr);
  if(!sessionStorage.getItem(rndStr)) {dom.storageSTest="failed"} else {dom.storageSTest="success"};
} catch(e) {dom.storageSTest="failed: " + e.name};

// indexedDB support
try {if (!window.indexedDB) {dom.IDBSupport="disabled"} else {dom.IDBSupport="enabled"};
} catch(e) {dom.IDBSupport="disabled: " + e.name};
// indexedDB test: run even if IDB unavailable
rndStr = rndString();
try {
  var openIDB = indexedDB.open(rndStr);
  openIDB.onerror = function(event) {dom.IDBTest = "failed: onerror"};
  // create objectStore
  openIDB.onupgradeneeded = function(event){
    var dbObject = event.target.result;
    var dbStore = dbObject.createObjectStore("testIDB", {keyPath: "id"});
  };
  // assume the test fails
  dom.IDBTest="failed";
  // test
  openIDB.onsuccess = function(event) {
    var dbObject = event.target.result;
    // start transaction
    var dbTx = dbObject.transaction("testIDB", "readwrite");
    var dbStore = dbTx.objectStore("testIDB");
    // add some data
    var rndIndex = rndNumber(); var rndValue = rndString();
    // console.log("   stored: name: "+rndStr+" id: "+rndIndex+" value: "+rndValue);
    dbStore.put( {id: rndIndex, value: rndValue} );
    // query the data
    var getStr = dbStore.get(rndIndex);
    getStr.onsuccess = function() {
      // console.log("retrieved: name: "+rndStr+" id: "+getStr.result.id+" value: "+getStr.result.value);
      if (getStr.result.value == rndValue) {dom.IDBTest="success";};
    };
    // close transaction
    dbTx.oncomplete = function() {dbObject.close();}
  };
} catch(e) {dom.IDBTest="failed: " + e.name};

// appCache support (browser.cache.offline.enable)
if ("applicationCache" in window) {
  dom.appCacheSupport="enabled";
  // appCache test
  if ((location.protocol) === "https:") {
    // https://www.html5rocks.com/en/tutorials/appcache/beginner/
    // working demo: https://archive.jonathanstark.com/labs/app-cache-2b/
    try {
      // var appCache = window.applicationCache;
      // appCache.update();
      dom.appCacheTest="test to come";
    } catch(e) {dom.appCacheTest="failed: " + e.name;};
  }
  else {dom.appCacheTest="n/a"}; // skip if insecure
}
else {
  dom.appCacheSupport="disabled"; dom.appCacheTest="n/a"; // skip if no appCache
};

// worker support
if (typeof(Worker) !== "undefined") {
  dom.workerSupport="enabled";
  if ((location.protocol) !== "file:") {
    // web worker test
    var wwt;
    try {
      wwt = new Worker("js/worker.js");
      var rndStr1 = rndString();
      // assume failure
      dom.webWTest="failed";
      // add listener
      wwt.addEventListener("message", function(e) {
        // console.log("data <- web worker: "+e.data);
        if ("TZP-"+rndStr1 === e.data) {dom.webWTest="success";}
      }, false);
      // post data
      wwt.postMessage(rndStr1);
      // console.log ("data -> web worker: "+rndStr1);
    } catch(e) {dom.webWTest="failed: " + e.name};
    // shared worker test
    var swt;
    try {
      swt = new SharedWorker("js/workershared.js");
      var rndStr2 = rndString();
      // assume failure
      dom.sharedWTest="failed"
      // add listener
      swt.port.addEventListener("message", function(e) {
        // console.log("data <- shared worker: "+e.data);
        if ("TZP-"+rndStr2 === e.data) {dom.sharedWTest="success";}
      }, false);
      swt.port.start();
      // post data      
      swt.port.postMessage(rndStr2);
      // console.log ("data -> shared worker: "+rndStr2);
    } catch(e) {dom.sharedWTest="failed: " + e.name};
  }
  else {dom.webWTest="n/a"; dom.sharedWTest="n/a"}; // skip if file
}
else {
  dom.workerSupport="disabled"; dom.webWTest="n/a"; dom.sharedWTest="n/a"; // skip if no worker
};

// service worker support (dom.serviceWorkers.enabled)
// note: serviceWorker is automatically not available in PB Mode
if ((location.protocol) === "https:") {
  if ("serviceWorker" in navigator) {
    dom.serviceWSupport="enabled";
    // service worker test
    navigator.serviceWorker.register("js/workerservice.js").then(function(registration) {
      dom.serviceWTest="success";

      // service worker cache support (dom.caches.enabled)
      dom.serviceWCacheSupport="test to come";
      // service cache test
      dom.serviceWCacheTest="test to come";

      // notifications support (dom.webnotifications.serviceworker.enabled)
      dom.notificationsSupport="test to come";
      // notifications test
      dom.notificationsTest="test to come";

    },
    function(e) {
      // catch e.name length for when scripts or extensions block it
      if (e.name ==="") {var swMsg = "failed: unknown error"} else {var swMsg = "failed: "+ e.name;};
      dom.serviceWTest=swMsg;
      dom.serviceWCacheSupport=swMsg; dom.serviceWCacheTest=swMsg;
      dom.notificationsSupport=swMsg; dom.notificationsTest=swMsg;
    });
  }
  else {
    // skip if no SW
    dom.serviceWSupport="disabled"; dom.serviceWTest="n/a";
    dom.serviceWCacheSupport="n/a"; dom.serviceWCacheTest="n/a";
    dom.notificationsSupport="n/a"; dom.notificationsTest="n/a"};
}
else { // skip if insecure
  var swMsg="n/a"; dom.serviceWSupport=swMsg; dom.serviceWTest=swMsg;
  dom.serviceWCacheSupport=swMsg; dom.serviceWCacheTest=swMsg;
  dom.notificationsSupport=swMsg; dom.notificationsTest=swMsg;
};

// permissions notifications / push
navigator.permissions.query({name:"notifications"}).then(e => dom.pNotifications=e.state);
navigator.permissions.query({name:"push"}).then(e => dom.pPush=e.state);

// storage manager support (dom.storageManager.enabled)
if ("storage" in navigator) {
  dom.storageMSupport="enabled"
  // don't test local
  if ((location.protocol) !== "file:") {
    // storage manager properties
    try {
      navigator.storage.persist().then(function(persistent) {
        if (persistent) dom.storageMProp="persistent";
        else dom.storageMProp="not persistent";
        navigator.storage.estimate().then(estimate => {
          dom.storageMProp.textContent += ` (${estimate.usage} of ${estimate.quota} bytes)`;
        });
      });
    } catch(e) {dom.storageMProp="failed: " + e.name};
    // storage manager test
    try {
      // store some data, get usage/quota
      dom.storageMTest="test to come"
    } catch(e) {dom.storageMTest="failed: " + e.name};
  }
  else {
    dom.storageMProp="n/a"; dom.storageMTest="n/a"; // skip if file:
  };
}
else {
  dom.storageMSupport="disabled"; dom.storageMProp="n/a"; dom.storageMTest="n/a"; // skip if no SM
};

// permission persistent-storage
navigator.permissions.query({name:"persistent-storage"}).then(e => dom.pPersistentStorage=e.state);

// storage access support (dom.storage_access.enabled)
// FF65+ https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API
// this is for embedded cross-origin content
try {Document.hasStorageAccess().then(e => e.state);
      //console.log("enabled");
} catch(e) { };
// storage access test: use Document.requestStorageAccess()
