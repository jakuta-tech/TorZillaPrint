/* TABLE: Cookies & Storage */

'use strict';

// functions
function getCookie(name) {
	name = name + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0 ; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
};
function rndString() {
	return Math.random().toString(36).substring(2, 15)
};
function rndNumber() {
	return Math.floor((Math.random() * (99999 - 10000)) + 10000)
};

function outputCookies() {

	/*** cookie support */
	if (navigator.cookieEnabled == true) {
		dom.nCookieEnabled = "enabled"
	} else {
		dom.nCookieEnabled = "disabled"
	};

	/*** session cookie test: run even if cookieEnabled = false */
	let rndStrA = rndString();
	document.cookie = rndStrA + "=" + rndStrA;
	if (getCookie(rndStrA) != "") {
		dom.cTest = "success"
	} else {
		dom.cTest = "failed"
	};

	/*** persistent cookie test: run even if cookieEnabled = false */
	let rndStrB = rndString();
	dom.cTest2.innerHTML = note_testtocome;

	/*** localStorage support */
	try {
		if (typeof(localStorage) != "undefined") {
			dom.storageLSupport = "enabled"
		}	else {
			dom.storageLSupport = "disabled: undefined"
		}
	} catch(e) {
		dom.storageLSupport = "disabled: " + e.name
	};

	/*** localStorage test: run even if localStorage unavailable */
	let rndStrC = rndString();
	try {
		localStorage.setItem(rndStrC, rndStrC);
		if (!localStorage.getItem(rndStrC)) {
			dom.storageLTest = "failed"
		} else {
			dom.storageLTest = "success"
		}
	} catch(e) {
		dom.storageLTest = "failed: " + e.name
	};

	/*** sessionStorage support */
	try {
		if (typeof(sessionStorage) != "undefined") {
			dom.storageSSupport = "enabled"
		} else {
			dom.storageSSupport = "disabled: undefined"
		}
	} catch(e) {
		dom.storageSSupport = "disabled: " + e.name
	};

	/*** sessionStorage test: run even if sessionStorage unavailable */
	let rndStrD = rndString();
	try {
		sessionStorage.setItem(rndStrD, rndStrD);
		if (!sessionStorage.getItem(rndStrD)) {
			dom.storageSTest = "failed"
		} else {
			dom.storageSTest = "success"
		}
	} catch(e) {
		dom.storageSTest = "failed: " + e.name
	};

	/*** indexedDB support */
	try {
		if (!window.indexedDB) {
			dom.IDBSupport = "disabled"
		} else {
			dom.IDBSupport = "enabled"
		}
	} catch(e) {
		dom.IDBSupport = "disabled: " + e.name
	};

	/*** indexedDB test: run even if IDB unavailable */
	try {
		let dbIDB = indexedDB.open("IsPBMode");
		dbIDB.onerror = function() {
			// current pb mode
			dom.IDBTest = "failed: onerror";
		};
		dbIDB.onsuccess = function() {
			let rndStrE = rndString();
			// normal mode
			try {
				let openIDB = indexedDB.open(rndStrE);
				// create objectStore
				openIDB.onupgradeneeded = function(event){
					let dbObject = event.target.result;
					let dbStore = dbObject.createObjectStore("testIDB", {keyPath: "id"});
				};
				// test
				openIDB.onsuccess = function(event) {
					let dbObject = event.target.result;
					// start transaction
					let dbTx = dbObject.transaction("testIDB", "readwrite");
					let dbStore = dbTx.objectStore("testIDB");
					// add some data
					let rndIndex = rndNumber();
					let rndValue = rndString();
					// console.log("	 stored: name: "+rndStrE+" id: "+rndIndex+" value: "+rndValue);
					dbStore.put( {id: rndIndex, value: rndValue} );
					// query the data
					let getStr = dbStore.get(rndIndex);
					getStr.onsuccess = function() {
						// console.log("retrieved: name: "+rndStrE+" id: "+getStr.result.id+" value: "+getStr.result.value);
						if (getStr.result.value == rndValue) {
							dom.IDBTest = "success"
						} else {
							dom.IDBTest = "failed: values didn't match" // this should never occur?
						}
					}
					// close transaction
					dbTx.oncomplete = function() {dbObject.close();}
				};
			} catch(e) {
				dom.IDBTest = "failed: " + e.name
			}
		}
	} catch(e) {
		// blocking cookies or something
		dom.IDBTest = "failed .open: " + e.name
	};

	/*** appCache support (browser.cache.offline.enable) */
	if ("applicationCache" in window) {
		dom.appCacheSupport = "enabled";
		if ((location.protocol) === "https:") {
			/*** appCache test */
			try {
				dom.appCacheTest.innerHTML = note_testtocome
			} catch(e) {
				dom.appCacheTest = "failed: " + e.name
			}
		}
		else {
			// skip if insecure
			if ((location.protocol) == "file:") {
				dom.appCacheTest.innerHTML= "n/a" + note_file
			} else {
				dom.appCacheTest = "n/a"
			}
		}
	}
	else {
		// skip if not supported
		dom.appCacheSupport = "disabled";
		dom.appCacheTest = "n/a";
	};

	/*** worker support */
	if (typeof(Worker) !== "undefined") {
		dom.workerSupport = "enabled";
		if ((location.protocol) !== "file:") {
			/*** web worker test */
			try {
				let wwt = new Worker("js/worker.js");
				let rndStr1 = rndString();
				// assume failure
				dom.webWTest = "failed";
				// add listener
				wwt.addEventListener("message", function(e) {
					// console.log("data <- web worker: "+e.data);
					if ("TZP-" + rndStr1 === e.data) {
						dom.webWTest = "success"
					}
				}, false);
				wwt.postMessage(rndStr1);
			} catch(e) {
				dom.webWTest = "failed: " + e.name
			};

			/*** shared worker test */
			try {
				let swt = new SharedWorker("js/workershared.js");
				let rndStr2 = rndString();
				// assume failure
				dom.sharedWTest = "failed"
				// add listener
				swt.port.addEventListener("message", function(e) {
					// console.log("data <- shared worker: "+e.data);
					if ("TZP-" + rndStr2 === e.data) {
						dom.sharedWTest = "success"
					}
				}, false);
				swt.port.start();
				swt.port.postMessage(rndStr2);
			} catch(e) {
				dom.sharedWTest = "failed: " + e.name
			}
		} else {
			// skip if file
			dom.webWTest.innerHTML= "n/a" + note_file;
			dom.sharedWTest.innerHTML= "n/a" + note_file;
		}
	} else {
		// skip if no worker
		dom.workerSupport = "disabled";
		dom.webWTest = "n/a";
		dom.sharedWTest = "n/a";
	};

	/*** service worker support (dom.serviceWorkers.enabled) */
	// note: serviceWorker is automatically not available in PB Mode
	let swMsg = "";
	if ((location.protocol) === "https:") {
		if ("serviceWorker" in navigator) {
			dom.serviceWSupport = "enabled";
			// unregister any existing sw?
			//navigator.serviceWorker.getRegistrations().then(
			//function(registrations) {
			//	for(let registration of registrations) {  
			//		registration.unregister();
			//	}
			//});

			/*** service worker test */
			navigator.serviceWorker.register("js/workerservice.js").then(function(registration) {
				dom.serviceWTest="success";

				/*** service worker cache support (dom.caches.enabled) */
				dom.serviceWCacheSupport.innerHTML = note_testtocome;

				/*** service cache test */
				dom.serviceWCacheTest.innerHTML = note_testtocome;

				/*** notifications support (dom.webnotifications.serviceworker.enabled) */
				dom.notificationsSupport.innerHTML = note_testtocome;

				/*** notifications test */
				dom.notificationsTest.innerHTML = note_testtocome;

				// unregister the sw?
			},
			function(e) {
				// skip if service worker error
				// catch e.name length for when scripts or extensions block it
				if (e.name ==="") {
					swMsg = "failed: unknown error"
				} else {
					swMsg = "failed: "+ e.name
				}
				dom.serviceWTest = swMsg;
				dom.serviceWCacheSupport = "n/a";
				dom.serviceWCacheTest = "n/a";
				dom.notificationsSupport = "n/a";
				dom.notificationsTest = "n/a";
			});
		}
		else {
			// skip if no service worker
			dom.serviceWSupport = "disabled";
			dom.serviceWTest = "n/a";
			dom.serviceWCacheSupport = "n/a";
			dom.serviceWCacheTest = "n/a";
			dom.notificationsSupport = "n/a";
			dom.notificationsTest = "n/a";
		}
	}	else {
		// skip if file
		if ((location.protocol) == "file:") {
			swMsg = "n/a" + note_file
		} else {
			swMsg = "n/a"
		};
		dom.serviceWSupport.innerHTML = swMsg;
		dom.serviceWTest.innerHTML = swMsg;
		dom.serviceWCacheSupport.innerHTML = swMsg;
		dom.serviceWCacheTest.innerHTML = swMsg;
		dom.notificationsSupport.innerHTML = swMsg;
		dom.notificationsTest.innerHTML = swMsg;
	};

	/*** permissions notifications / push */
	if (amFF == true) {
		navigator.permissions.query({name:"notifications"}).then(e => dom.pNotifications=e.state);
		navigator.permissions.query({name:"push"}).then(e => dom.pPush=e.state);
	};

	/*** storage manager support (dom.storageManager.enabled) **/
	if ("storage" in navigator) {
		dom.storageMSupport = "enabled"
		if ((location.protocol) !== "file:") {

			/*** storage manager properties */
			try {
				navigator.storage.persist().then(function(persistent) {
					if (persistent) dom.storageMProp="persistent";
					else dom.storageMProp="not persistent";
					navigator.storage.estimate().then(estimate => {
						dom.storageMProp.textContent += ` (${estimate.usage} of ${estimate.quota} bytes)`;
					});
				});
			} catch(e) {
				dom.storageMProp="failed: " + e.name
			};

			/*** storage manager test */
			try {
				// store some data, get usage/quota
				dom.storageMTest.innerHTML = note_testtocome;
			} catch(e) {
				dom.storageMTest = "failed: " + e.name
			}
		}	else {
			// skip if file
			dom.storageMProp.innerHTML = "n/a" + note_file;
			dom.storageMTest.innerHTML = "n/a" + note_file;
		};
	}
	else {
		// skip if not supported
		dom.storageMSupport = "disabled";
		dom.storageMProp = "n/a";
		dom.storageMTest = "n/a";
	};

	/*** permission persistent-storage */
	navigator.permissions.query({name:"persistent-storage"}).then(e => dom.pPersistentStorage=e.state);

};

outputCookies();
