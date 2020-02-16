/* TABLE: Cookies & Storage */
'use strict';

/* GENERIC FUNCTIONS */

function rnd_string(type) {
	return type + Math.random().toString(36).substring(2, 15)
}

function rnd_number() {
	return Math.floor((Math.random() * (99999-10000))+10000)
}

function lookup_cookie(name) {
	name += "="
	let decodedCookie = decodeURIComponent(document.cookie)
	let ca = decodedCookie.split(';');
	for(let i=0 ; i < ca.length; i++) {
		let c = ca[i]
		while (c.charAt(0) == " ") {
			c = c.substring(1)
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length)
		}
	}
	return ""
}

/* FUNCTIONS */

function get_cookies() {
	// support
	dom.ctest0 = (navigator.cookieEnabled == true ? zE : zD)

	// session test
	let rndA = rnd_string("sc_")
	let rndB = rnd_string("")
	document.cookie = rndA + "=" + rndB
	let svalue = lookup_cookie(rndA)
	if (svalue != "") {
		if (logStorage) {
			console.log(" set:", rndA.padStart(18) + " -", rndB)
			console.log("read:", rndA.padStart(18) + " -", svalue)
		}
		if (svalue == rndB) {
			dom.ctest1 = zS
		} else {
			dom.ctest1 = zF+": values do not match"
		}
	} else {
		dom.ctest1 = zF
	}

	// persistent test
	let rndC = rnd_string("pc_")
	let rndD = rnd_string("")
	let d = new Date()
	d.setTime(d.getTime() + 86400000) // 1 day
	let expires = "expires="+ d.toUTCString()
	document.cookie = rndC + "=" + rndD + ";" + expires
	let pvalue = lookup_cookie(rndC)
	if (pvalue != "") {
		if (logStorage) {
			console.log(" set:", rndC.padStart(18) + " -", rndD)
			console.log("read:", rndC.padStart(18) + " -", pvalue)
		}
		if (pvalue == rndD) {
			dom.ctest2 = zS
		} else {
			dom.ctest2 = zF+": values do not match"
		}
	} else {
		dom.ctest2 = zF
	}
}

function get_storage() {
	// LS support
	try {
		if (typeof(localStorage) != "undefined") {
			dom.lstest0 = zE
		}	else {
			dom.lstest0 = zD+": undefined"
		}
	} catch(e) {
		dom.lstest0 = zD+": " + e.name
	}
	// LS test
	try {
		let rndE = rnd_string("pls_")
		let rndF = rnd_string("")
		localStorage.setItem(rndE, rndF)
		let lsvalue = localStorage.getItem(rndE)
		if (lsvalue == null) {
			dom.lstest1 = zF
		} else {
			if (logStorage) {
				console.log(" set:", rndE.padStart(18) + " -", rndF)
				console.log("read:", rndE.padStart(18) + " -", lsvalue)
			}			
			if (lsvalue == rndF) {
				dom.lstest1 = zS
			} else {
				dom.lstest1 = zF+": values do not match"
			}
		}
	} catch(e) {
		dom.lstest1 = zF+": " + e.name
	}
	// SS support
	try {
		if (typeof(sessionStorage) != "undefined") {
			dom.lstest2 = zE
		} else {
			dom.lstest2 = zD+": undefined"
		}
	} catch(e) {
		dom.lstest2 = zD+": " + e.name
	}
	// SS test
	try {
		let rndStrG = rnd_string("sls_")
		let rndStrH = rnd_string("")
		sessionStorage.setItem(rndStrG, rndStrH)
		let ssvalue = sessionStorage.getItem(rndStrG)
		if (ssvalue == null) {
			dom.lstest3 = zF
		} else {
			if (logStorage) {
				console.log(" set:", rndStrG.padStart(18) + " -", rndStrH)
				console.log("read:", rndStrG.padStart(18) + " -", ssvalue)
			}			
			if (ssvalue == rndStrH) {
				dom.lstest3 = zS
			} else {
				dom.lstest3 = zF+": values do not match"
			}
		}
	} catch(e) {
		dom.lstest3 = zF+": " + e.name
	}
}

function get_idb() {
	// support
	try {
		if (!window.indexedDB) {
			dom.idb1 = zD
		} else {
			dom.idb1 = zE
		}
	} catch(e) {
		dom.idb1 = zD+": " + e.name
	}
	// test
	try {
		let dbIDB = indexedDB.open("_testPBMode")
		dbIDB.onerror = function() {
			// pb mode
			dom.idb2 = zF+": onerror"
		}
		dbIDB.onsuccess = function() {
			let rndStrI = rnd_string("idb_")
			// normal mode
			try {
				let openIDB = indexedDB.open(rndStrI)
				// create objectStore
				openIDB.onupgradeneeded = function(event){
					let dbObject = event.target.result
					let dbStore = dbObject.createObjectStore("testIDB", {keyPath: "id"})
				}
				// test
				openIDB.onsuccess = function(event) {
					let dbObject = event.target.result
					// start transaction
					let dbTx = dbObject.transaction("testIDB", "readwrite")
					let dbStore = dbTx.objectStore("testIDB")
					// add some data
					let rndIndex = rnd_number()
					let rndValue = rnd_string("")
					if (logStorage) {
						console.log(" set:", rndStrI.padStart(18) + " -", rndIndex, rndValue)
					}
					dbStore.put( {id: rndIndex, value: rndValue} )
					// query the data
					let getStr = dbStore.get(rndIndex)
					getStr.onsuccess = function() {
						if (logStorage) {
							console.log("read:", rndStrI.padStart(18) + " -", getStr.result.id, getStr.result.value)
						}
						if (getStr.result.value == rndValue) {
							dom.idb2 = zS
						} else {
							dom.idb2 = zF+": values do not match"
						}
					}
					// close transaction
					dbTx.oncomplete = function() {dbObject.close()}
				}
			} catch(e) {
				dom.idb2 = zF+": " + e.name
			}
		}
	} catch(e) {
		// blocking cookies or something
		dom.idb2 = zF+" .open: " + e.name
	}
}

function get_appcache() {
	// support
	if ("applicationCache" in window) {
		dom.appCacheSupport = zE
		if (isSecure) {
			// test
			try {
				dom.appCacheTest.innerHTML = note_ttc
			} catch(e) {
				dom.appCacheTest = zF+": " + e.name
			}
		} else {
			// insecure
			dom.appCacheTest.innerHTML= zNA + note_file
		}
	} else {
		// not-supported
		dom.appCacheSupport = zD
		dom.appCacheTest = zNA
	}
}

function get_workers() {

	// worker support
	if (typeof(Worker) !== "undefined") {
		dom.workerSupport = zE
		if (isFile) {
			// isFile
			dom.webWTest.innerHTML= zNA + note_file;
			dom.sharedWTest.innerHTML= zNA + note_file;
		} else {
			// web worker test
			try {
				let wwt = new Worker("js/worker.js")
				let rndStr1 = rnd_string()
				// assume failure
				dom.webWTest = zF
				// add listener
				wwt.addEventListener("message", function(e) {
					if (logStorage) {console.log("data <- web worker: "+e.data)}
					if ("TZP-" + rndStr1 === e.data) {
						dom.webWTest = zS
					}
				}, false)
				wwt.postMessage(rndStr1)
			} catch(e) {
				dom.webWTest = zF+": " + e.name
			}
			// shared worker test
			try {
				let swt = new SharedWorker("js/workershared.js")
				let rndStr2 = rnd_string()
				// assume failure
				dom.sharedWTest = zF
				// add listener
				swt.port.addEventListener("message", function(e) {
					if (logStorage) {console.log("data <- shared worker: "+e.data)}
					if ("TZP-" + rndStr2 === e.data) {
						dom.sharedWTest = zS
					}
				}, false);
				swt.port.start();
				swt.port.postMessage(rndStr2);
			} catch(e) {
				dom.sharedWTest = zF+": " + e.name
			}
		}
	} else {
		// no worker
		dom.workerSupport = zD; dom.webWTest = zNA; dom.sharedWTest = zNA
	}
}

function get_service_workers() {
	let output = ""
	// support
	if (isSecure) {
		if ("serviceWorker" in navigator) {
			dom.serviceWSupport = zE
			// test
			navigator.serviceWorker.register("js/workerservice.js").then(function(registration) {
				dom.serviceWTest = zS
				// cache support
				dom.serviceWCacheSupport.innerHTML = note_ttc
				// cache test
				dom.serviceWCacheTest.innerHTML = note_ttc
				// notifications support
				dom.notificationsSupport.innerHTML = note_ttc
				// notifications test
				dom.notificationsTest.innerHTML = note_ttc
				// ToDo: service workers: unregister the sw
			},
			function(e) {
				// sw error
				if (e.name ==="") {
					output = zF+": unknown error"
				} else {
					output = zF+": "+ e.name
				}
				dom.serviceWTest = output
				dom.serviceWCacheSupport = zNA; dom.serviceWCacheTest = zNA
				dom.notificationsSupport = zNA; dom.notificationsTest = zNA
			})
		}	else {
			// no service worker
			dom.serviceWSupport = zD
			dom.serviceWTest = zNA; dom.serviceWCacheSupport = zNA
			dom.serviceWCacheTest = zNA; dom.notificationsSupport = zNA
			dom.notificationsTest = zNA
		}
	}	else {
		// isFile
		output = zNA + note_file
		dom.serviceWSupport.innerHTML = output; dom.serviceWTest.innerHTML = output
		dom.serviceWCacheSupport.innerHTML = output; dom.serviceWCacheTest.innerHTML = output
		dom.notificationsSupport.innerHTML = output; dom.notificationsTest.innerHTML = output
	}
}

function get_permissions() {
	// permissions notifications / push
	if (isFF) {
		navigator.permissions.query({name:"notifications"}).then(e => dom.pNotifications=e.state)
		navigator.permissions.query({name:"push"}).then(e => dom.pPush=e.state)
	}
	// permission persistent-storage
	navigator.permissions.query({name:"persistent-storage"}).then(e => dom.pPersistentStorage=e.state)
}

function get_storage_manager() {
	// support
	if ("storage" in navigator) {
		dom.storageMSupport = zE
		if (isFile) {
			dom.storageMProp.innerHTML = zNA + note_file
			dom.storageMTest.innerHTML = zNA + note_file
		} else {
			// properties
			try {
				navigator.storage.persist().then(function(persistent) {
					if (persistent) dom.storageMProp="persistent"
					else dom.storageMProp="not persistent"
					navigator.storage.estimate().then(estimate => {
						dom.storageMProp.textContent += ` (${estimate.usage} of ${estimate.quota} bytes)`
					})
				})
			} catch(e) {
				dom.storageMProp = zF+": " + e.name
			}
			// test
			try {
				dom.storageMTest.innerHTML = note_ttc
			} catch(e) {
				dom.storageMTest = zF+": " + e.name
			}
		}
	}
	else {
		// not-supported
		dom.storageMSupport = zD; dom.storageMProp = zNA; dom.storageMTest = zNA
	}
}

function outputCookies() {
	let t0 = performance.now()
	// functions
	get_cookies()
	get_storage()
	get_idb()
	get_appcache()
	get_workers()
	get_service_workers()
	get_permissions()
	get_storage_manager()
	// perf
	debug_page("perf","cookies",t0,gt0)
}

outputCookies()
